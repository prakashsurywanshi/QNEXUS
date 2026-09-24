<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use App\Http\Responses\LoginResponse;
use App\Models\Role;
use App\Models\User;
use App\Scopes\SocietyScope;
use Database\Seeders\DummyUsersSeeder;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Laravel\Fortify\Features;
use Laravel\Fortify\Fortify;

class FortifyServiceProvider extends ServiceProvider
{
    /**
     * Resolve the demo accounts seeded by DummyUsersSeeder into display rows
     * for the login screen.
     *
     * @param  list<array{email: string}>  $accounts
     * @return list<array{name: string, email: string, role: string, society: string}>
     */
    private function demoUsers(array $accounts): array
    {
        $emails = array_column($accounts, 'email');

        return User::query()
            ->with('society')
            ->whereIn('email', $emails)
            ->get()
            ->map(fn (User $user) => [
                'name' => $user->name,
                'email' => $user->email,
                'role' => $this->roleLabel($user),
                'society' => $user->society?->name ?? 'Platform',
            ])
            ->sortBy([
                fn (array $a, array $b) => $a['society'] <=> $b['society'],
                fn (array $a, array $b) => $a['role'] <=> $b['role'],
            ])
            ->values()
            ->all();
    }

    private function roleLabel(User $user): string
    {
        if ($user->email === 'superadmin@qnexus.test') {
            return 'Super Admin';
        }

        $role = $user->role_id !== null
            ? Role::withoutGlobalScope(SocietyScope::class)->find($user->role_id)
            : null;

        return $role?->display_name ?? 'Member';
    }

    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureActions();
        $this->configureViews();
        $this->configureRateLimiting();
    }

    /**
     * Configure Fortify actions.
     */
    private function configureActions(): void
    {
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);
        Fortify::createUsersUsing(CreateNewUser::class);

        $this->app->singleton(LoginResponseContract::class, LoginResponse::class);
    }

    /**
     * Configure Fortify views.
     */
    private function configureViews(): void
    {
        Fortify::loginView(fn (Request $request) => Inertia::render('auth/login', [
            'canResetPassword' => Features::enabled(Features::resetPasswords()),
            'status' => $request->session()->get('status'),
            'demoPassword' => DummyUsersSeeder::PASSWORD,
            'demoUsers' => $this->demoUsers(DummyUsersSeeder::demoAccounts()),
        ]));

        Fortify::resetPasswordView(fn (Request $request) => Inertia::render('auth/reset-password', [
            'email' => $request->email,
            'token' => $request->route('token'),
            'passwordRules' => Password::defaults()->toPasswordRulesString(),
        ]));

        Fortify::requestPasswordResetLinkView(fn (Request $request) => Inertia::render('auth/forgot-password', [
            'status' => $request->session()->get('status'),
        ]));

        Fortify::verifyEmailView(fn (Request $request) => Inertia::render('auth/verify-email', [
            'status' => $request->session()->get('status'),
        ]));

        Fortify::registerView(fn () => Inertia::render('auth/register', [
            'passwordRules' => Password::defaults()->toPasswordRulesString(),
        ]));

        Fortify::twoFactorChallengeView(fn () => Inertia::render('auth/two-factor-challenge'));

        Fortify::confirmPasswordView(fn () => Inertia::render('auth/confirm-password'));
    }

    /**
     * Configure rate limiting.
     */
    private function configureRateLimiting(): void
    {
        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by($request->session()->get('login.id'));
        });

        RateLimiter::for('login', function (Request $request) {
            $throttleKey = Str::transliterate(Str::lower($request->input(Fortify::username())).'|'.$request->ip());

            return Limit::perMinute(5)->by($throttleKey);
        });

        RateLimiter::for('passkeys', function (Request $request) {
            return Limit::perMinute(10)->by(
                ($request->input('credential.id') ?: $request->session()->getId()).'|'.$request->ip(),
            );
        });
    }
}
