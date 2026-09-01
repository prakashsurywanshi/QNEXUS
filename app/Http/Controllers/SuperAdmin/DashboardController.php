<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\GlobalSubscription;
use App\Models\Package;
use App\Models\Society;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('superadmin/dashboard', [
            'stats' => [
                'societies' => Society::count(),
                'users' => User::count(),
                'packages' => Package::count(),
                'subscriptions' => GlobalSubscription::count(),
            ],
            'recentSocieties' => Society::latest()
                ->limit(5)
                ->get(['id', 'name', 'slug', 'property_type', 'is_active', 'created_at']),
        ]);
    }
}
