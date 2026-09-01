<?php

use App\Http\Controllers\AmenityController;
use App\Http\Controllers\ApartmentController;
use App\Http\Controllers\AssetController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\FloorController;
use App\Http\Controllers\GatepassController;
use App\Http\Controllers\LedgerController;
use App\Http\Controllers\MaintenanceController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\NoticeController;
use App\Http\Controllers\PatrolController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PollController;
use App\Http\Controllers\RentInvoiceController;
use App\Http\Controllers\ServiceClockController;
use App\Http\Controllers\ServiceManagementController;
use App\Http\Controllers\ServiceTypeController;
use App\Http\Controllers\SocietyAdminController;
use App\Http\Controllers\SocietySwitchController;
use App\Http\Controllers\TowerController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\VisitorController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::resource('towers', TowerController::class)->only(['index', 'show']);
    Route::get('towers/{tower}/floors', [FloorController::class, 'index'])->name('floors.index');
    Route::get('apartments', [ApartmentController::class, 'index'])->name('apartments.index');
    Route::get('amenities', [AmenityController::class, 'index'])->name('amenities.index');
    Route::get('assets', [AssetController::class, 'index'])->name('assets.index');
    Route::get('services', [ServiceManagementController::class, 'index'])->name('service-management.index');
    Route::get('service-types', [ServiceTypeController::class, 'index'])->name('service-types.index');
    Route::get('service-log', [ServiceClockController::class, 'index'])->name('service-log.index');
    Route::get('visitors', [VisitorController::class, 'index'])->name('visitors.index');
    Route::get('gatepasses', [GatepassController::class, 'index'])->name('gatepasses.index');
    Route::get('patrol', [PatrolController::class, 'index'])->name('patrol.index');
    Route::get('maintenance', [MaintenanceController::class, 'index'])->name('maintenance.index');
    Route::get('payments', [PaymentController::class, 'index'])->name('payments.index');
    Route::get('budgets', [BudgetController::class, 'index'])->name('budgets.index');
    Route::get('notices', [NoticeController::class, 'index'])->name('notices.index');
    Route::get('events', [EventController::class, 'index'])->name('events.index');
    Route::get('polls', [PollController::class, 'index'])->name('polls.index');
    Route::get('societies', [SocietyAdminController::class, 'index'])->name('societies.index');
    Route::get('members', [MemberController::class, 'index'])->name('members.index');
    Route::get('ledger', [LedgerController::class, 'index'])->name('ledger.index');
    Route::get('vendors', [VendorController::class, 'index'])->name('vendors.index');
    Route::get('invoices', [RentInvoiceController::class, 'index'])->name('invoices.index');

    Route::post('society/{society}/switch', SocietySwitchController::class)
        ->name('society.switch');
});

require __DIR__.'/settings.php';
