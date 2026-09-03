<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\Society;
use App\Models\SocietyUser;
use App\Models\User;
use App\Scopes\SocietyScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

/**
 * Seeds demo data for the platform:
 *
 * 1. Makes the superadmin the id=1 user (one-time, guarded raw id swap with
 *    the current id-1 user, re-pointing the society_user pivot). The
 *    superadmin's platform access is driven by `society_id = null`, not its
 *    id, so this only changes identity/ordering.
 *
 * 2. Ensures a commercial demo society exists (provisioned automatically by
 *    the SocietyObserver -> ProvisionSociety pipeline on creation).
 *
 * 3. Seeds three demo users per role (Admin, Manager, Owner, Tenant, Guard)
 *    into both the residential and commercial demo societies. All demo users
 *    share the password 'password' so each role can be logged into easily.
 *
 * Idempotent: safe to run repeatedly via `php artisan db:seed` or
 * `php artisan db:seed --class=DummyUsersSeeder`.
 */
class DummyUsersSeeder extends Seeder
{
    private const PASSWORD = 'password';

    private const SUPERADMIN_EMAIL = 'superadmin@qnexus.test';

    public function run(): void
    {
        $this->makeSuperadminUserOne();

        $residential = Society::firstOrCreate(
            ['name' => 'Demo Society Villa'],
            ['property_type' => 'residential', 'is_active' => true],
        );

        $commercial = Society::firstOrCreate(
            ['name' => 'Demo Commercial Tower'],
            ['property_type' => 'commercial', 'is_active' => true],
        );

        $users = $this->seedSocietyUsers($residential, '');
        $users = array_merge($users, $this->seedSocietyUsers($commercial, 'cm-'));

        // Seed comprehensive society data (towers, apartments, amenities, tickets, etc.).
        $societyDataSeeder = new SocietyDataSeeder;
        $societyDataSeeder->run($residential);
        $societyDataSeeder->run($commercial);

        $this->printCredentials($users);
    }

    /**
     * Ensure the platform superadmin is user id 1. When the superadmin is not
     * already id 1, it swaps raw ids with the current id-1 user (the demo
     * admin) and re-points the affected society_user pivot rows. Runs once.
     */
    private function makeSuperadminUserOne(): void
    {
        $superadmin = User::where('email', self::SUPERADMIN_EMAIL)->first();

        if ($superadmin === null || $superadmin->id === 1) {
            return;
        }

        $swapB = User::find(1);

        if ($swapB === null || $swapB->id === $superadmin->id) {
            return;
        }

        $swapA = $superadmin;
        $oldA = $swapA->id;
        $oldB = $swapB->id;
        $map = [$oldA => 1, $oldB => $oldA];

        // A temporary id that does not collide with any existing user id.
        $tempId = (int) (DB::table('users')->max('id') + 1);

        DB::transaction(function () use ($oldA, $oldB, $map, $tempId) {
            // Detach pivots for both users to avoid RESTRICT FK blocking the
            // raw primary-key update.
            $pivotRows = SocietyUser::whereIn('user_id', [$oldA, $oldB])->get()->all();

            foreach ($pivotRows as $pivot) {
                SocietyUser::where('id', $pivot->id)->delete();
            }

            // Classic three-step raw id swap so the unique keys never collide.
            DB::table('users')->where('id', $oldA)->update(['id' => $tempId]);
            DB::table('users')->where('id', $oldB)->update(['id' => $oldA]);
            DB::table('users')->where('id', $tempId)->update(['id' => $oldB]);

            // Re-point and restore the detached pivot rows to their owners.
            foreach ($pivotRows as $pivot) {
                $newUserId = $map[$pivot->user_id] ?? $pivot->user_id;
                Model::unguarded(fn () => SocietyUser::create([
                    'user_id' => $newUserId,
                    'society_id' => $pivot->society_id,
                    'role_id' => $pivot->role_id,
                ]));
            }
        });
    }

    /**
     * @return list<User>
     */
    private function seedSocietyUsers(Society $society, string $prefix): array
    {
        $roleNames = config('modules.role_types'); // Admin, Manager, Owner, Tenant, Guard

        $roles = [];
        foreach ($roleNames as $displayName) {
            $roles[$displayName] = Role::withoutGlobalScope(SocietyScope::class)
                ->where('society_id', $society->id)
                ->where('display_name', $displayName)
                ->first();
        }

        $users = [];
        foreach ($roleNames as $displayName) {
            $role = $roles[$displayName] ?? null;
            if ($role === null) {
                continue;
            }

            for ($i = 1; $i <= 3; $i++) {
                $suffix = $i === 1 ? '' : (string) $i;
                $slug = strtolower($displayName);

                $user = User::firstOrCreate(
                    ['email' => $prefix.$slug.$suffix.'@demo.test'],
                    [
                        'name' => $society->name.' '.$displayName.' '.$i,
                        'password' => Hash::make(self::PASSWORD),
                        'email_verified_at' => now(),
                        'phone_number' => $this->dummyPhone(),
                        'society_id' => $society->id,
                        'role_id' => $role->id,
                    ],
                );

                $expectedName = $society->name.' '.$displayName.' '.$i;

                if ($user->society_id !== $society->id
                    || $user->role_id !== $role->id
                    || $user->name !== $expectedName
                    || $user->email_verified_at === null) {
                    $user->update([
                        'society_id' => $society->id,
                        'role_id' => $role->id,
                        'name' => $expectedName,
                        'email_verified_at' => $user->email_verified_at ?? now(),
                    ]);
                }

                $hasPivot = SocietyUser::where('user_id', $user->id)
                    ->where('society_id', $society->id)
                    ->exists();

                if (! $hasPivot) {
                    Model::unguarded(fn () => SocietyUser::create([
                        'user_id' => $user->id,
                        'society_id' => $society->id,
                        'role_id' => $role->id,
                    ]));
                }

                $users[] = $user;
            }
        }

        return $users;
    }

    private function dummyPhone(): string
    {
        return '9'.random_int(100000000, 999999999);
    }

    /**
     * @param  list<User>  $users
     */
    private function printCredentials(array $users): void
    {
        $this->command->newLine();
        $this->command->info('=== QNEXUS Demo Credentials (password: '.self::PASSWORD.') ===');

        $header = ['email', 'name', 'society / role'];
        $rows = [];

        foreach (['superadmin@qnexus.test', 'admin@qnexus.test', 'test@example.com'] as $platformEmail) {
            $platform = User::where('email', $platformEmail)->first();
            if ($platform === null) {
                continue;
            }

            $rows[] = [
                'email' => $platform->email,
                'name' => $platform->name,
                'role' => match ($platformEmail) {
                    'superadmin@qnexus.test' => 'Platform / Super Admin',
                    'admin@qnexus.test' => 'Demo Society Villa / Admin',
                    default => 'Platform / Test User',
                },
            ];
        }

        foreach ($users as $user) {
            $society = Society::find($user->society_id);
            $role = Role::withoutGlobalScope(SocietyScope::class)->find($user->role_id);
            $rows[] = [
                'email' => $user->email,
                'name' => $user->name,
                'role' => ($society->name ?? 'superadmin').' / '.($role->display_name ?? 'Platform Admin'),
            ];
        }

        $this->command->table($header, $rows);
    }
}
