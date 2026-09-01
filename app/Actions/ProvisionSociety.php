<?php

namespace App\Actions;

use App\Models\GlobalCurrency;
use App\Models\GlobalInvoice;
use App\Models\GlobalSubscription;
use App\Models\Package;
use App\Models\Permission;
use App\Models\Role;
use App\Models\Society;

/**
 * Provisions everything a newly created society needs: per-society roles,
 * a default package subscription, first invoice and default currency link.
 */
class ProvisionSociety
{
    public function __invoke(Society $society): void
    {
        $this->provisionRoles($society);
        $this->provisionSubscription($society);
    }

    private function provisionRoles(Society $society): void
    {
        $roleNames = config('modules.role_types', ['Admin', 'Manager', 'Owner', 'Tenant', 'Guard']);
        $rolePermissions = config('modules.role_permissions', []);

        /** @var array<string, Role|null> $roles */
        $roles = [];
        foreach ($roleNames as $displayName) {
            $roles[$displayName] = Role::firstOrCreate(
                [
                    'name' => $displayName.'_'.$society->id,
                    'guard_name' => 'web',
                ],
                [
                    'display_name' => $displayName,
                    'society_id' => $society->id,
                ]
            );
        }

        $allPermissions = Permission::pluck('name')->all();

        $adminRole = $roles['Admin'] ?? null;
        $managerRole = $roles['Manager'] ?? null;

        $adminRole?->syncPermissions($allPermissions);
        $managerRole?->syncPermissions($allPermissions);

        foreach (['Owner', 'Tenant', 'Guard'] as $role) {
            $roleModel = $roles[$role] ?? null;
            if (! $roleModel) {
                continue;
            }

            $roleModel->syncPermissions(
                Permission::whereIn('name', $rolePermissions[$role] ?? [])->get()
            );
        }
    }

    private function provisionSubscription(Society $society): void
    {
        $package = Package::where('is_free', 1)->orderBy('id')->first()
            ?? Package::where('package_type', 'default')->orderBy('id')->first();
        $currency = GlobalCurrency::where('status', 'enable')->orderBy('id')->first();

        if (! $package || ! $currency) {
            return;
        }

        if ($society->package_id === null) {
            $society->update(['package_id' => $package->id]);
        }

        if (GlobalSubscription::where('society_id', $society->id)->exists()) {
            return;
        }

        $subscription = GlobalSubscription::create([
            'society_id' => $society->id,
            'package_id' => $package->id,
            'currency_id' => $currency->id,
            'package_type' => $package->package_type,
            'name' => $package->package_name,
            'subscription_status' => 'active',
            'subscribed_on_date' => now(),
            'ends_at' => now()->addYear(),
        ]);

        GlobalInvoice::create([
            'society_id' => $society->id,
            'package_id' => $package->id,
            'currency_id' => $currency->id,
            'global_subscription_id' => $subscription->id,
            'package_type' => $package->package_type,
            'amount' => $package->monthly_price ?? 0,
            'status' => 'active',
            'pay_date' => now(),
            'next_pay_date' => now()->addMonth(),
            'gateway_name' => 'offline',
        ]);
    }
}
