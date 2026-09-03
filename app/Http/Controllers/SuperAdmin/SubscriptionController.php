<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\GlobalSubscription;
use App\Models\Package;
use App\Models\Society;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SubscriptionController extends Controller
{
    /**
     * List all subscriptions across the platform.
     */
    public function index(): Response
    {
        $subscriptions = GlobalSubscription::with(['society:id,name', 'package:id,package_name'])
            ->latest('id')
            ->get();

        return Inertia::render('superadmin/subscriptions/index', [
            'subscriptions' => $subscriptions,
            'societies' => Society::orderBy('id')->get(['id', 'name']),
            'packages' => Package::orderBy('id')->get(['id', 'package_name']),
        ]);
    }

    /**
     * Activate a subscription.
     */
    public function activate(GlobalSubscription $subscription): RedirectResponse
    {
        $subscription->update(['subscription_status' => 'active']);

        return redirect()->route('superadmin.subscriptions.index');
    }

    /**
     * Deactivate a subscription.
     */
    public function deactivate(GlobalSubscription $subscription): RedirectResponse
    {
        $subscription->update(['subscription_status' => 'inactive']);

        return redirect()->route('superadmin.subscriptions.index');
    }

    /**
     * Link a society to a subscription (used when provisioning from billing).
     */
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'society_id' => ['required', 'exists:societies,id'],
            'package_id' => ['required', 'exists:packages,id'],
        ]);

        $society = Society::whereKey($data['society_id'])->firstOrFail();
        $package = Package::whereKey($data['package_id'])->firstOrFail();

        $society->update(['package_id' => $package->id]);

        GlobalSubscription::create([
            'society_id' => $society->id,
            'package_id' => $package->id,
            'name' => $package->package_name,
            'subscription_status' => 'active',
            'subscribed_on_date' => now(),
            'ends_at' => now()->addYear(),
        ]);

        return redirect()->route('superadmin.subscriptions.index');
    }
}
