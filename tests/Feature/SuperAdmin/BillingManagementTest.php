<?php

namespace Tests\Feature\SuperAdmin;

use App\Models\GlobalInvoice;
use App\Models\GlobalSubscription;
use App\Models\OfflinePlanChange;
use App\Models\Package;
use App\Models\Society;
use App\Models\SuperadminPaymentGateway;

class BillingManagementTest extends SuperAdminTestCase
{
    public function test_subscriptions_index_renders_with_data(): void
    {
        $society = Society::create(['name' => 'Billing Society', 'property_type' => 'residential']);
        $package = Package::firstOrFail();

        GlobalSubscription::create([
            'society_id' => $society->id,
            'package_id' => $package->id,
            'name' => $package->package_name,
            'subscription_status' => 'active',
            'subscribed_on_date' => now(),
        ]);

        $this->get(route('superadmin.subscriptions.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('superadmin/subscriptions/index')
                ->where('subscriptions.0.society.name', 'Billing Society')
                ->has('societies')
                ->has('packages'));
    }

    public function test_superadmin_can_assign_package_via_subscription_store(): void
    {
        $society = Society::create(['name' => 'Store Society', 'property_type' => 'mixed']);
        $package = Package::firstOrFail();

        $this->post(route('superadmin.subscriptions.store'), [
            'society_id' => $society->id,
            'package_id' => $package->id,
        ])->assertRedirect(route('superadmin.subscriptions.index'));

        $this->assertDatabaseHas('global_subscriptions', ['society_id' => $society->id, 'package_id' => $package->id]);
        $this->assertDatabaseHas('societies', ['id' => $society->id, 'package_id' => $package->id]);
    }

    public function test_superadmin_can_activate_and_deactivate_subscription(): void
    {
        $society = Society::create(['name' => 'Sub Society', 'property_type' => 'residential']);
        $package = Package::firstOrFail();

        $subscription = GlobalSubscription::create([
            'society_id' => $society->id,
            'package_id' => $package->id,
            'subscription_status' => 'inactive',
            'subscribed_on_date' => now(),
        ]);

        $this->post(route('superadmin.subscriptions.activate', $subscription))
            ->assertRedirect(route('superadmin.subscriptions.index'));

        $this->assertSame('active', $subscription->fresh()->subscription_status);

        $this->post(route('superadmin.subscriptions.deactivate', $subscription))
            ->assertRedirect(route('superadmin.subscriptions.index'));

        $this->assertSame('inactive', $subscription->fresh()->subscription_status);
    }

    public function test_superadmin_can_view_invoices(): void
    {
        $society = Society::create(['name' => 'Invoice Society', 'property_type' => 'commercial']);

        GlobalInvoice::create([
            'society_id' => $society->id,
            'amount' => 199.99,
            'total' => 199.99,
            'invoice_id' => 'INV-001',
            'status' => 'active',
            'gateway_name' => 'razorpay',
            'pay_date' => now(),
        ]);

        $this->get(route('superadmin.invoices.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('superadmin/invoices/index')
                ->where('invoices.0.society.name', 'Invoice Society'));
    }

    public function test_superadmin_can_update_gateway_settings(): void
    {
        SuperadminPaymentGateway::create(['stripe_status' => false]);

        $this->put(route('superadmin.gateways.update'), [
            'razorpay_type' => 'live',
            'razorpay_status' => true,
            'stripe_type' => 'test',
            'stripe_status' => true,
            'flutterwave_type' => 'test',
            'flutterwave_status' => false,
        ])->assertRedirect(route('superadmin.gateways.index'));

        $gateway = SuperadminPaymentGateway::firstOrFail();
        $this->assertTrue((bool) $gateway->razorpay_status);
        $this->assertSame('live', $gateway->razorpay_type);
        $this->assertTrue((bool) $gateway->stripe_status);
    }

    public function test_offline_requests_can_be_verified_and_rejected(): void
    {
        $society = Society::create(['name' => 'Offline Society', 'property_type' => 'residential']);
        $package = Package::firstOrFail();

        $request = OfflinePlanChange::create([
            'society_id' => $society->id,
            'package_id' => $package->id,
            'package_type' => 'monthly',
            'description' => 'Want to upgrade',
            'amount' => 99,
            'status' => 'pending',
        ]);

        $this->post(route('superadmin.offline-requests.verify', $request))
            ->assertRedirect(route('superadmin.offline-requests.index'));

        $this->assertSame('verified', $request->fresh()->status);

        $second = OfflinePlanChange::create([
            'society_id' => $society->id,
            'package_id' => $package->id,
            'package_type' => 'yearly',
            'description' => 'Reject me',
            'amount' => 50,
            'status' => 'pending',
        ]);

        $this->post(route('superadmin.offline-requests.reject', $second))
            ->assertRedirect(route('superadmin.offline-requests.index'));

        $this->assertSame('rejected', $second->fresh()->status);
    }
}