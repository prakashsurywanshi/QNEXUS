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
    Route::controller(AmenityController::class)
        ->prefix('amenities')
        ->name('amenities.')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{amenity}/edit', 'edit')->name('edit');
            Route::put('{amenity}', 'update')->name('update');
            Route::delete('{amenity}', 'destroy')->name('destroy');
        });
    Route::controller(AssetController::class)
        ->prefix('assets')
        ->name('assets.')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{asset}/edit', 'edit')->name('edit');
            Route::put('{asset}', 'update')->name('update');
            Route::delete('{asset}', 'destroy')->name('destroy');
        });
    Route::controller(ServiceManagementController::class)
        ->prefix('services')
        ->name('service-management.')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{service}/edit', 'edit')->name('edit');
            Route::put('{service}', 'update')->name('update');
            Route::delete('{service}', 'destroy')->name('destroy');
        });
    Route::get('service-types', [ServiceTypeController::class, 'index'])->name('service-types.index');
    Route::get('service-log', [ServiceClockController::class, 'index'])->name('service-log.index');
    Route::controller(VisitorController::class)
        ->prefix('visitors')
        ->name('visitors.')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{visitor}/edit', 'edit')->name('edit');
            Route::put('{visitor}', 'update')->name('update');
            Route::delete('{visitor}', 'destroy')->name('destroy');
        });
    Route::controller(GatepassController::class)
        ->prefix('gatepasses')
        ->name('gatepasses.')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{gatepass}/edit', 'edit')->name('edit');
            Route::put('{gatepass}', 'update')->name('update');
            Route::delete('{gatepass}', 'destroy')->name('destroy');
        });
    Route::controller(PatrolController::class)
        ->prefix('patrol')
        ->name('patrol.')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{checkpoint}/edit', 'edit')->name('edit');
            Route::put('{checkpoint}', 'update')->name('update');
            Route::delete('{checkpoint}', 'destroy')->name('destroy');
        });
    Route::controller(MaintenanceController::class)
        ->prefix('maintenance')
        ->name('maintenance.')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{maintenance}/edit', 'edit')->name('edit');
            Route::put('{maintenance}', 'update')->name('update');
            Route::delete('{maintenance}', 'destroy')->name('destroy');
        });
    Route::controller(PaymentController::class)
        ->prefix('payments')
        ->name('payments.')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{payment}/edit', 'edit')->name('edit');
            Route::put('{payment}', 'update')->name('update');
            Route::delete('{payment}', 'destroy')->name('destroy');
        });
    Route::controller(BudgetController::class)
        ->prefix('budgets')
        ->name('budgets.')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{budget}/edit', 'edit')->name('edit');
            Route::put('{budget}', 'update')->name('update');
            Route::delete('{budget}', 'destroy')->name('destroy');
        });
    Route::controller(NoticeController::class)
        ->prefix('notices')
        ->name('notices.')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{notice}/edit', 'edit')->name('edit');
            Route::put('{notice}', 'update')->name('update');
            Route::delete('{notice}', 'destroy')->name('destroy');
        });
    Route::controller(EventController::class)
        ->prefix('events')
        ->name('events.')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{event}/edit', 'edit')->name('edit');
            Route::put('{event}', 'update')->name('update');
            Route::delete('{event}', 'destroy')->name('destroy');
        });
    Route::controller(PollController::class)
        ->prefix('polls')
        ->name('polls.')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{poll}/edit', 'edit')->name('edit');
            Route::put('{poll}', 'update')->name('update');
            Route::delete('{poll}', 'destroy')->name('destroy');
        });
    Route::controller(SocietyAdminController::class)
        ->prefix('societies')
        ->name('societies.')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{society}/edit', 'edit')->name('edit');
            Route::put('{society}', 'update')->name('update');
            Route::delete('{society}', 'destroy')->name('destroy');
        });
    Route::controller(MemberController::class)
        ->prefix('members')
        ->name('members.')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{member}/edit', 'edit')->name('edit');
            Route::put('{member}', 'update')->name('update');
            Route::delete('{member}', 'destroy')->name('destroy');
        });
    Route::controller(LedgerController::class)
        ->prefix('ledger')
        ->name('ledger.')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{entry}/edit', 'edit')->name('edit');
            Route::put('{entry}', 'update')->name('update');
            Route::delete('{entry}', 'destroy')->name('destroy');
        });
    Route::controller(VendorController::class)
        ->prefix('vendors')
        ->name('vendors.')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{vendor}/edit', 'edit')->name('edit');
            Route::put('{vendor}', 'update')->name('update');
            Route::delete('{vendor}', 'destroy')->name('destroy');
        });
    Route::controller(RentInvoiceController::class)
        ->prefix('invoices')
        ->name('invoices.')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{invoice}/edit', 'edit')->name('edit');
            Route::put('{invoice}', 'update')->name('update');
            Route::delete('{invoice}', 'destroy')->name('destroy');
        });

    Route::post('society/{society}/switch', SocietySwitchController::class)
        ->name('society.switch');
});

require __DIR__.'/settings.php';
