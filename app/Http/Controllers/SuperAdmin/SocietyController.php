<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\GlobalCurrency;
use App\Models\GlobalSubscription;
use App\Models\Package;
use App\Models\Role;
use App\Models\Society;
use App\Models\User;
use App\Scopes\SocietyScope;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SocietyController extends Controller
{
    /**
     * List all societies for the superadmin portal.
     */
    public function index(Request $request): Response
    {
        $roleNames = Role::withoutGlobalScope(SocietyScope::class)
            ->pluck('display_name', 'id')
            ->all();

        $societies = Society::withCount(['users', 'roles'])
            ->with(['package'])
            ->orderBy('id')
            ->get();

        $users = User::select('id', 'society_id', 'name', 'email', 'role_id')->get();
        $membersBySociety = [];

        foreach ($users as $user) {
            $membersBySociety[$user->society_id][] = [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $roleNames[$user->role_id] ?? $user->role_id,
            ];
        }

        $societies = $societies->map(function (Society $society) use ($membersBySociety): Society {
            $society->setAttribute('members', $membersBySociety[$society->id] ?? []);

            return $society;
        });

        return Inertia::render('superadmin/societies/index', [
            'societies' => $societies,
            'packages' => Package::orderBy('id')->get(['id', 'package_name']),
        ]);
    }

    /**
     * Show the form to provision a new society.
     */
    public function create(): Response
    {
        return Inertia::render('superadmin/societies/create');
    }

    /**
     * Provision a new society. It starts inactive and must be activated from
     * the QNEXUS management dashboard before its members can sign in.
     */
    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateSociety($request);

        $data['is_active'] = false;

        Society::create($data);

        return redirect()->route('superadmin.societies.index');
    }

    /**
     * Show the form to edit a society's profile.
     */
    public function edit(Society $society): Response
    {
        return Inertia::render('superadmin/societies/edit', [
            'society' => $society,
        ]);
    }

    /**
     * Update a society's profile.
     */
    public function update(Request $request, Society $society): RedirectResponse
    {
        $society->update($this->validateSociety($request));

        return redirect()->route('superadmin.societies.index');
    }

    /**
     * Activate a society so its members can access the portal.
     */
    public function activate(Society $society): RedirectResponse
    {
        $society->update(['is_active' => true]);

        return redirect()->route('superadmin.societies.index');
    }

    /**
     * Deactivate a society, blocking its members from the portal.
     */
    public function deactivate(Society $society): RedirectResponse
    {
        $society->update(['is_active' => false]);

        return redirect()->route('superadmin.societies.index');
    }

    /**
     * Assign (or reassign) a package to a society, creating or updating its
     * active subscription.
     */
    public function assignPackage(Request $request, Society $society): RedirectResponse
    {
        $data = $request->validate([
            'package_id' => ['required', 'exists:packages,id'],
        ]);

        $package = Package::whereKey($data['package_id'])->firstOrFail();
        $currency = GlobalCurrency::where('status', 'enable')->orderBy('id')->first();

        $society->update(['package_id' => $package->id]);

        $subscription = GlobalSubscription::where('society_id', $society->id)->latest('id')->first();

        if ($subscription) {
            $subscription->update([
                'package_id' => $package->id,
                'currency_id' => $currency?->id,
                'package_type' => $package->package_type,
                'name' => $package->package_name,
                'subscription_status' => 'active',
                'subscribed_on_date' => $subscription->subscribed_on_date ?? now(),
                'ends_at' => now()->addYear(),
            ]);
        } else {
            GlobalSubscription::create([
                'society_id' => $society->id,
                'package_id' => $package->id,
                'currency_id' => $currency?->id,
                'package_type' => $package->package_type,
                'name' => $package->package_name,
                'subscription_status' => 'active',
                'subscribed_on_date' => now(),
                'ends_at' => now()->addYear(),
            ]);
        }

        return redirect()->route('superadmin.societies.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function validateSociety(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email'],
            'phone_number' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string'],
            'property_type' => ['required', Rule::in(['residential', 'commercial', 'mixed'])],
            'timezone' => ['nullable', 'string', 'max:255'],
            'show_logo_text' => ['boolean'],
        ]);
    }
}
