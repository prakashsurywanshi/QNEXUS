<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\GlobalInvoice;
use App\Models\GlobalSubscription;
use App\Models\OfflinePlanChange;
use App\Models\Package;
use App\Models\Society;
use App\Models\SuperadminPaymentGateway;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $societies = Society::get(['id', 'property_type', 'is_active']);

        $packageCounts = Package::withCount('societies')->get();

        return Inertia::render('superadmin/dashboard', [
            'stats' => [
                'societies' => $societies->count(),
                'users' => User::count(),
                'packages' => $packageCounts->count(),
                'subscriptions' => GlobalSubscription::count(),
                'offline_requests' => OfflinePlanChange::where('status', 'pending')->count(),
                'active_subscriptions' => GlobalSubscription::where('subscription_status', 'active')->count(),
                'inactive_subscriptions' => GlobalSubscription::where('subscription_status', 'inactive')->count(),
                'expected_revenue' => (float) GlobalInvoice::sum('amount'),
                'paid_invoices' => GlobalInvoice::where('status', 'active')->count(),
                'gateways' => SuperadminPaymentGateway::count(),
            ],
            'recentSocieties' => Society::withCount('users')
                ->latest()
                ->limit(5)
                ->get(['id', 'name', 'slug', 'property_type', 'is_active', 'created_at']),
            'societiesByType' => $societies
                ->groupBy('property_type')
                ->map(fn ($group) => $group->count()),
            'activeSocieties' => $societies->where('is_active', true)->count(),
            'inactiveSocieties' => $societies->where('is_active', false)->count(),
            'packageUsage' => $packageCounts->map(fn (Package $package) => [
                'name' => $package->package_name,
                'societies' => $package->societies_count,
            ]),
            'recentInvoices' => GlobalInvoice::with(['society', 'package'])
                ->latest()
                ->limit(5)
                ->get(['id', 'society_id', 'package_id', 'amount', 'gateway_name', 'status', 'pay_date', 'created_at']),
            'offlineRequests' => OfflinePlanChange::with('society')
                ->latest()
                ->limit(5)
                ->get(),
        ]);
    }
}
