<?php

use App\Http\Controllers\SuperAdmin\BlogPostController;
use App\Http\Controllers\SuperAdmin\CmsPageController;
use App\Http\Controllers\SuperAdmin\CmsSectionController;
use App\Http\Controllers\SuperAdmin\DashboardController;
use App\Http\Controllers\SuperAdmin\GatewayController;
use App\Http\Controllers\SuperAdmin\GlobalSettingController;
use App\Http\Controllers\SuperAdmin\InvoiceController;
use App\Http\Controllers\SuperAdmin\OfflineRequestController;
use App\Http\Controllers\SuperAdmin\PackageController;
use App\Http\Controllers\SuperAdmin\SocietyController;
use App\Http\Controllers\SuperAdmin\SocietyImpersonateController;
use App\Http\Controllers\SuperAdmin\SubscriptionController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'superadmin'])
    ->prefix('super-admin')
    ->name('superadmin.')
    ->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

        Route::get('settings', [GlobalSettingController::class, 'edit'])->name('settings.edit');
        Route::put('settings', [GlobalSettingController::class, 'update'])->name('settings.update');

        Route::resource('cms/pages', CmsPageController::class)
            ->names('cms.pages')
            ->except('show');

        Route::resource('cms/sections', CmsSectionController::class)
            ->names('cms.sections')
            ->except('show');

        Route::resource('blog/posts', BlogPostController::class)
            ->names('blog.posts')
            ->except('show');

        Route::resource('packages', PackageController::class)
            ->names('packages')
            ->except('show');

        // Billing & gateways management.
        Route::get('subscriptions', [SubscriptionController::class, 'index'])->name('subscriptions.index');
        Route::post('subscriptions', [SubscriptionController::class, 'store'])->name('subscriptions.store');
        Route::post('subscriptions/{subscription}/activate', [SubscriptionController::class, 'activate'])->name('subscriptions.activate');
        Route::post('subscriptions/{subscription}/deactivate', [SubscriptionController::class, 'deactivate'])->name('subscriptions.deactivate');

        Route::get('invoices', [InvoiceController::class, 'index'])->name('invoices.index');

        Route::get('gateways', [GatewayController::class, 'index'])->name('gateways.index');
        Route::put('gateways', [GatewayController::class, 'update'])->name('gateways.update');

        Route::get('offline-requests', [OfflineRequestController::class, 'index'])->name('offline-requests.index');
        Route::post('offline-requests/{offlinePlanChange}/verify', [OfflineRequestController::class, 'verify'])->name('offline-requests.verify');
        Route::post('offline-requests/{offlinePlanChange}/reject', [OfflineRequestController::class, 'reject'])->name('offline-requests.reject');

        // Societies management.
        Route::get('societies', [SocietyController::class, 'index'])->name('societies.index');
        Route::get('societies/create', [SocietyController::class, 'create'])->name('societies.create');
        Route::post('societies', [SocietyController::class, 'store'])->name('societies.store');
        Route::get('societies/{society}/edit', [SocietyController::class, 'edit'])->name('societies.edit');
        Route::put('societies/{society}', [SocietyController::class, 'update'])->name('societies.update');
        Route::post('societies/{society}/activate', [SocietyController::class, 'activate'])->name('societies.activate');
        Route::post('societies/{society}/deactivate', [SocietyController::class, 'deactivate'])->name('societies.deactivate');
        Route::post('societies/{society}/assign-package', [SocietyController::class, 'assignPackage'])->name('societies.assign-package');

        // Superadmin impersonation: log in as a society user (admin or member).
        Route::post('societies/{society}/impersonate/{user}', [SocietyImpersonateController::class, 'impersonate'])
            ->name('societies.impersonate');
    });

// Stop impersonation: accessible while impersonating (user is a society admin,
// not a superadmin), so this lives outside the superadmin middleware group.
Route::middleware(['auth', 'verified'])
    ->post('super-admin/stop-impersonate', [SocietyImpersonateController::class, 'stop'])
    ->name('superadmin.stop-impersonate');
