<?php

namespace App\Actions;

use App\Models\GlobalCurrency;
use App\Models\GlobalInvoice;
use App\Models\GlobalSubscription;
use App\Models\Package;
use App\Models\Society;
use Database\Seeders\RoleSeeder;

/**
 * Provisions everything a newly created society needs: per-society roles,
 * a default package subscription and the first invoice.
 */
class ProvisionSociety
{
    public function __invoke(Society $society): void
    {
        (new RoleSeeder)->run($society);
        $this->provisionSubscription($society);
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
