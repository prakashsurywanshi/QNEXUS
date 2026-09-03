<?php

use App\Http\Controllers\AdvanceAccountController;
use App\Http\Controllers\AmcManagementController;
use App\Http\Controllers\AmenityBookingController;
use App\Http\Controllers\AmenityController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\ApartmentController;
use App\Http\Controllers\ApprovalController;
use App\Http\Controllers\AssetController;
use App\Http\Controllers\AssistantController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\AutomationController;
use App\Http\Controllers\BoomBarrierLogController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\CamChargeController;
use App\Http\Controllers\ChartOfAccountController;
use App\Http\Controllers\CommercialTenantController;
use App\Http\Controllers\CommercialUnitController;
use App\Http\Controllers\ComplianceItemController;
use App\Http\Controllers\CreditNoteController;
use App\Http\Controllers\DailyHelpController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\EmergencyBroadcastController;
use App\Http\Controllers\EmergencyContactController;
use App\Http\Controllers\EnergyController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\FamilyMemberController;
use App\Http\Controllers\FixedDepositController;
use App\Http\Controllers\FloorController;
use App\Http\Controllers\FrontendController;
use App\Http\Controllers\GatepassController;
use App\Http\Controllers\JournalVoucherController;
use App\Http\Controllers\LeaseAgreementController;
use App\Http\Controllers\LedgerController;
use App\Http\Controllers\MaintenanceController;
use App\Http\Controllers\MeetingController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\MoveRecordController;
use App\Http\Controllers\NoticeController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\NotificationPreferenceController;
use App\Http\Controllers\PushSubscriptionController;
use App\Http\Controllers\ParkingController;
use App\Http\Controllers\PatrolController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PetController;
use App\Http\Controllers\PollController;
use App\Http\Controllers\PrepaidMeterController;
use App\Http\Controllers\PurchaseInvoiceController;
use App\Http\Controllers\PurchaseOrderController;
use App\Http\Controllers\QrVerifyController;
use App\Http\Controllers\RentInvoiceController;
use App\Http\Controllers\ServiceClockController;
use App\Http\Controllers\ServiceManagementController;
use App\Http\Controllers\ServiceRequestController;
use App\Http\Controllers\ServiceTypeController;
use App\Http\Controllers\SmartDeviceController;
use App\Http\Controllers\SocietyAdminController;
use App\Http\Controllers\SocietySwitchController;
use App\Http\Controllers\SosAlertController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\TowerController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\VendorContractController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\VendorPaymentController;
use App\Http\Controllers\VisitorController;
use App\Http\Controllers\VisitorPreapprovalController;
use App\Http\Controllers\VisitorTypeSettingsController;
use App\Http\Controllers\WorkOrderController;
use Illuminate\Support\Facades\Route;

Route::middleware(['disable.landing'])->group(function () {
    Route::get('/', [FrontendController::class, 'home'])->name('home');
    Route::get('page/{slug}', [FrontendController::class, 'page'])->name('site.page');
    Route::get('blog', [FrontendController::class, 'blog'])->name('site.blog');
    Route::get('blog/{slug}', [FrontendController::class, 'post'])->name('site.post');
});

Route::get('qr/{token}', QrVerifyController::class)->name('qr.verify');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    Route::get('analytics', [AnalyticsController::class, 'index'])
        ->name('analytics.index')->middleware('module.enabled:Analytics');

    Route::get('assistant', [AssistantController::class, 'index'])
        ->name('assistant.index')->middleware('module.enabled:AI Assistant');
    Route::post('assistant/ask', [AssistantController::class, 'ask'])
        ->name('assistant.ask')->middleware('module.enabled:AI Assistant');

    Route::resource('towers', TowerController::class)->only(['index', 'show'])->middleware('module.enabled:Tower');
    Route::get('towers/{tower}/floors', [FloorController::class, 'index'])->name('floors.index')->middleware('module.enabled:Tower');
    Route::get('apartments', [ApartmentController::class, 'index'])->name('apartments.index')->middleware('module.enabled:Apartment');
    Route::controller(AmenityController::class)
        ->prefix('amenities')
        ->name('amenities.')
        ->middleware('module.enabled:Amenities')
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
        ->middleware('module.enabled:Assets')
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
        ->middleware('module.enabled:Service Provider')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{service}/edit', 'edit')->name('edit');
            Route::put('{service}', 'update')->name('update');
            Route::delete('{service}', 'destroy')->name('destroy');
        });
    Route::get('service-types', [ServiceTypeController::class, 'index'])->name('service-types.index')->middleware('module.enabled:Service Provider');
    Route::get('service-log', [ServiceClockController::class, 'index'])->name('service-log.index')->middleware('module.enabled:Service Time Logging');
    Route::controller(AttendanceController::class)
        ->prefix('attendance')
        ->name('attendance.')
        ->middleware('module.enabled:Worker Checkins')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::post('/', 'store')->name('store');
            Route::put('{record}', 'update')->name('update');
            Route::delete('{record}', 'destroy')->name('destroy');
        });
    Route::controller(StaffController::class)
        ->prefix('staff')
        ->name('staff.')
        ->middleware('module.enabled:Staff Management')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{staff}/edit', 'edit')->name('edit');
            Route::put('{staff}', 'update')->name('update');
            Route::delete('{staff}', 'destroy')->name('destroy');
            Route::get('{staff}/attendance', 'attendance')->name('attendance');
            Route::post('{staff}/attendance', 'clockIn')->name('attendance.store');
            Route::put('{staff}/attendance/{log}', 'clockOut')->name('attendance.update');
            Route::delete('{staff}/attendance/{log}', 'destroyLog')->name('attendance.destroy');
        });
    Route::controller(VisitorController::class)
        ->prefix('visitors')
        ->name('visitors.')
        ->middleware('module.enabled:Visitors')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{visitor}/edit', 'edit')->name('edit');
            Route::put('{visitor}', 'update')->name('update');
            Route::delete('{visitor}', 'destroy')->name('destroy');
        });
    Route::controller(VisitorPreapprovalController::class)
        ->prefix('visitor-preapprovals')
        ->name('visitor-preapprovals.')
        ->middleware('module.enabled:Visitor Preapprovals')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{visitorPreapproval}/edit', 'edit')->name('edit');
            Route::put('{visitorPreapproval}', 'update')->name('update');
            Route::delete('{visitorPreapproval}', 'destroy')->name('destroy');
        });
    Route::controller(VisitorTypeSettingsController::class)
        ->prefix('visitor-types')
        ->name('visitor-types.')
        ->middleware('module.enabled:Visitor Preapprovals')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{visitorType}/edit', 'edit')->name('edit');
            Route::put('{visitorType}', 'update')->name('update');
            Route::delete('{visitorType}', 'destroy')->name('destroy');
        });
    Route::controller(AmenityBookingController::class)
        ->prefix('amenity-bookings')
        ->name('amenity-bookings.')
        ->middleware('module.enabled:Book Amenity')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{booking}/edit', 'edit')->name('edit');
            Route::put('{booking}', 'update')->name('update');
            Route::delete('{booking}', 'destroy')->name('destroy');
        });
    Route::controller(TicketController::class)
        ->prefix('tickets')
        ->name('tickets.')
        ->middleware('module.enabled:Tickets')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{ticket}', 'show')->name('show');
            Route::post('{ticket}/reply', 'reply')->name('reply');
            Route::get('{ticket}/edit', 'edit')->name('edit');
            Route::put('{ticket}', 'update')->name('update');
            Route::delete('{ticket}', 'destroy')->name('destroy');
        });
    Route::controller(ServiceRequestController::class)
        ->prefix('service-requests')
        ->name('service-requests.')
        ->middleware('module.enabled:Service Requests')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{serviceRequest}', 'show')->name('show');
            Route::post('{serviceRequest}/quote', 'quote')->name('quote');
            Route::post('{serviceRequest}/assign', 'assign')->name('assign');
            Route::post('{serviceRequest}/advance', 'advance')->name('advance');
            Route::post('{serviceRequest}/reply', 'reply')->name('reply');
            Route::get('{serviceRequest}/edit', 'edit')->name('edit');
            Route::put('{serviceRequest}', 'update')->name('update');
            Route::delete('{serviceRequest}', 'destroy')->name('destroy');
        });
    Route::controller(WorkOrderController::class)
        ->prefix('work-orders')
        ->name('work-orders.')
        ->middleware('module.enabled:Work Orders')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{workOrder}/edit', 'edit')->name('edit');
            Route::put('{workOrder}', 'update')->name('update');
            Route::delete('{workOrder}', 'destroy')->name('destroy');
        });
    Route::controller(AmcManagementController::class)
        ->prefix('amc')
        ->name('amc.')
        ->middleware('module.enabled:AMC')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{amc}/edit', 'edit')->name('edit');
            Route::put('{amc}', 'update')->name('update');
            Route::delete('{amc}', 'destroy')->name('destroy');
        });
    Route::controller(DocumentController::class)
        ->prefix('documents')
        ->name('documents.')
        ->middleware('module.enabled:Documents')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{document}/edit', 'edit')->name('edit');
            Route::put('{document}', 'update')->name('update');
            Route::delete('{document}', 'destroy')->name('destroy');
        });
    Route::controller(NotificationController::class)
        ->prefix('notifications')
        ->name('notifications.')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::patch('read-all', 'markAllRead')->name('read-all');
            Route::patch('{notification}/read', 'markRead')->name('read');
        });
    Route::controller(NotificationPreferenceController::class)
        ->prefix('notifications/preferences')
        ->name('notification-preferences.')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::put('{category}', 'update')->name('update');
        });
    Route::controller(PushSubscriptionController::class)
        ->prefix('push/subscriptions')
        ->name('push-subscriptions.')
        ->group(function () {
            Route::post('/', 'store')->name('store');
            Route::delete('{endpoint}', 'destroy')->name('destroy');
        });
    Route::controller(ApprovalController::class)
        ->prefix('approvals')
        ->name('approvals.')
        ->middleware('module.enabled:Approvals')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::patch('{approval}/decide', 'decide')->name('decide');
            Route::patch('{approval}/steps/{step}/decide', 'decideStep')->name('decideStep');
            Route::delete('{approval}', 'destroy')->name('destroy');
        });
    Route::controller(AutomationController::class)
        ->prefix('automations')
        ->name('automations.')
        ->middleware('module.enabled:Automations')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::post('/', 'store')->name('store');
            Route::post('run', 'run')->name('run');
            Route::patch('{automation}/toggle', 'toggle')->name('toggle');
            Route::delete('{automation}', 'destroy')->name('destroy');
        });
    Route::controller(AuditLogController::class)
        ->prefix('audit-logs')
        ->name('audit-logs.')
        ->middleware('module.enabled:Audit Logs')
        ->group(function () {
            Route::get('/', 'index')->name('index');
        });
    Route::controller(EmergencyContactController::class)
        ->prefix('emergency-contacts')
        ->name('emergency-contacts.')
        ->middleware('module.enabled:Emergency Contacts')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{contact}/edit', 'edit')->name('edit');
            Route::put('{contact}', 'update')->name('update');
            Route::delete('{contact}', 'destroy')->name('destroy');
        });
    Route::controller(EmergencyBroadcastController::class)
        ->prefix('emergency-broadcasts')
        ->name('emergency-broadcasts.')
        ->middleware('module.enabled:Emergency Broadcast')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::post('{broadcast}/resolve', 'resolve')->name('resolve');
            Route::delete('{broadcast}', 'destroy')->name('destroy');
        });
    Route::controller(SosAlertController::class)
        ->prefix('sos-alerts')
        ->name('sos-alerts.')
        ->middleware('module.enabled:SOS Alerts')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::put('{alert}', 'update')->name('update');
            Route::delete('{alert}', 'destroy')->name('destroy');
        });
    Route::controller(SmartDeviceController::class)
        ->prefix('smart-devices')
        ->name('smart-devices.')
        ->middleware('module.enabled:Smart Building')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{smartDevice}/edit', 'edit')->name('edit');
            Route::put('{smartDevice}', 'update')->name('update');
            Route::delete('{smartDevice}', 'destroy')->name('destroy');
        });
    Route::controller(GatepassController::class)
        ->prefix('gatepasses')
        ->name('gatepasses.')
        ->middleware('module.enabled:Gatepasses')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{gatepass}/edit', 'edit')->name('edit');
            Route::get('{gatepass}/qr', 'showQr')->name('qr');
            Route::put('{gatepass}', 'update')->name('update');
            Route::delete('{gatepass}', 'destroy')->name('destroy');
        });
    Route::controller(PatrolController::class)
        ->prefix('patrol')
        ->name('patrol.')
        ->middleware('module.enabled:Patrol')
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
        ->middleware('module.enabled:Maintenance')
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
        ->middleware('module.enabled:Finance')
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
        ->middleware('module.enabled:Budgets')
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
        ->middleware('module.enabled:Notice Board')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{notice}/edit', 'edit')->name('edit');
            Route::put('{notice}', 'update')->name('update');
            Route::delete('{notice}', 'destroy')->name('destroy');
        });
    Route::controller(ParkingController::class)
        ->prefix('parking')
        ->name('parking.')
        ->middleware('module.enabled:Parking')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{parking}/edit', 'edit')->name('edit');
            Route::put('{parking}', 'update')->name('update');
            Route::delete('{parking}', 'destroy')->name('destroy');
        });
    Route::controller(EventController::class)
        ->prefix('events')
        ->name('events.')
        ->middleware('module.enabled:Events')
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
        ->middleware('module.enabled:Polls')
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
        ->middleware('module.enabled:Settings')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('{society}/edit', 'edit')->name('edit');
            Route::put('{society}', 'update')->name('update');
        });
    Route::controller(MemberController::class)
        ->prefix('members')
        ->name('members.')
        ->middleware('module.enabled:Members')
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
        ->middleware('module.enabled:General Ledger')
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
        ->middleware('module.enabled:Vendors')
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
        ->middleware('module.enabled:Finance')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{invoice}/edit', 'edit')->name('edit');
            Route::put('{invoice}', 'update')->name('update');
            Route::delete('{invoice}', 'destroy')->name('destroy');
        });
    Route::controller(CommercialUnitController::class)
        ->prefix('commercial-units')
        ->name('commercial-units.')
        ->middleware('module.enabled:Commercial Units')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{commercialUnit}/edit', 'edit')->name('edit');
            Route::put('{commercialUnit}', 'update')->name('update');
            Route::delete('{commercialUnit}', 'destroy')->name('destroy');
        });
    Route::controller(CommercialTenantController::class)
        ->prefix('commercial-tenants')
        ->name('commercial-tenants.')
        ->middleware('module.enabled:Commercial Tenants')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{commercialTenant}/edit', 'edit')->name('edit');
            Route::put('{commercialTenant}', 'update')->name('update');
            Route::delete('{commercialTenant}', 'destroy')->name('destroy');
        });
    Route::controller(LeaseAgreementController::class)
        ->prefix('lease-agreements')
        ->name('lease-agreements.')
        ->middleware('module.enabled:Lease Agreements')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{leaseAgreement}/edit', 'edit')->name('edit');
            Route::put('{leaseAgreement}', 'update')->name('update');
            Route::delete('{leaseAgreement}', 'destroy')->name('destroy');
        });
    Route::controller(CamChargeController::class)
        ->prefix('cam-charges')
        ->name('cam-charges.')
        ->middleware('module.enabled:CAM Charges')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{camCharge}/edit', 'edit')->name('edit');
            Route::put('{camCharge}', 'update')->name('update');
            Route::delete('{camCharge}', 'destroy')->name('destroy');
        });
    Route::controller(DailyHelpController::class)
        ->prefix('daily-help')
        ->name('daily-help.')
        ->middleware('module.enabled:Daily Help')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{worker}/edit', 'edit')->name('edit');
            Route::put('{worker}', 'update')->name('update');
            Route::delete('{worker}', 'destroy')->name('destroy');
        });

    Route::controller(ChartOfAccountController::class)
        ->prefix('chart-of-accounts')
        ->name('chart-of-accounts.')
        ->middleware('module.enabled:Chart of Accounts')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{chartOfAccount}/edit', 'edit')->name('edit');
            Route::put('{chartOfAccount}', 'update')->name('update');
            Route::delete('{chartOfAccount}', 'destroy')->name('destroy');
        });
    Route::controller(JournalVoucherController::class)
        ->prefix('journal-vouchers')
        ->name('journal-vouchers.')
        ->middleware('module.enabled:Journal Vouchers')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{journalVoucher}/edit', 'edit')->name('edit');
            Route::put('{journalVoucher}', 'update')->name('update');
            Route::delete('{journalVoucher}', 'destroy')->name('destroy');
        });
    Route::controller(CreditNoteController::class)
        ->prefix('credit-notes')
        ->name('credit-notes.')
        ->middleware('module.enabled:Credit Notes')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{creditNote}/edit', 'edit')->name('edit');
            Route::put('{creditNote}', 'update')->name('update');
            Route::delete('{creditNote}', 'destroy')->name('destroy');
        });
    Route::controller(AdvanceAccountController::class)
        ->prefix('advance-accounts')
        ->name('advance-accounts.')
        ->middleware('module.enabled:Advance Accounts')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{advanceAccount}/edit', 'edit')->name('edit');
            Route::put('{advanceAccount}', 'update')->name('update');
            Route::delete('{advanceAccount}', 'destroy')->name('destroy');
        });
    Route::controller(PurchaseOrderController::class)
        ->prefix('purchase-orders')
        ->name('purchase-orders.')
        ->middleware('module.enabled:Purchase Orders')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{purchaseOrder}/edit', 'edit')->name('edit');
            Route::put('{purchaseOrder}', 'update')->name('update');
            Route::delete('{purchaseOrder}', 'destroy')->name('destroy');
        });
    Route::controller(PurchaseInvoiceController::class)
        ->prefix('purchase-invoices')
        ->name('purchase-invoices.')
        ->middleware('module.enabled:Purchase Invoices')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{purchaseInvoice}/edit', 'edit')->name('edit');
            Route::put('{purchaseInvoice}', 'update')->name('update');
            Route::delete('{purchaseInvoice}', 'destroy')->name('destroy');
        });
    Route::controller(VendorContractController::class)
        ->prefix('vendor-contracts')
        ->name('vendor-contracts.')
        ->middleware('module.enabled:Vendor Contracts')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{vendorContract}/edit', 'edit')->name('edit');
            Route::put('{vendorContract}', 'update')->name('update');
            Route::delete('{vendorContract}', 'destroy')->name('destroy');
        });
    Route::controller(VendorPaymentController::class)
        ->prefix('vendor-payments')
        ->name('vendor-payments.')
        ->middleware('module.enabled:Vendor Payments')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{vendorPayment}/edit', 'edit')->name('edit');
            Route::put('{vendorPayment}', 'update')->name('update');
            Route::delete('{vendorPayment}', 'destroy')->name('destroy');
        });
    Route::controller(ComplianceItemController::class)
        ->prefix('compliance-items')
        ->name('compliance-items.')
        ->middleware('module.enabled:Compliance')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{complianceItem}/edit', 'edit')->name('edit');
            Route::put('{complianceItem}', 'update')->name('update');
            Route::delete('{complianceItem}', 'destroy')->name('destroy');
        });
    Route::controller(MeetingController::class)
        ->prefix('meetings')
        ->name('meetings.')
        ->middleware('module.enabled:Meetings')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{meeting}/edit', 'edit')->name('edit');
            Route::put('{meeting}', 'update')->name('update');
            Route::delete('{meeting}', 'destroy')->name('destroy');
        });
    Route::controller(PetController::class)
        ->prefix('pets')
        ->name('pets.')
        ->middleware('module.enabled:Pets')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{pet}/edit', 'edit')->name('edit');
            Route::put('{pet}', 'update')->name('update');
            Route::delete('{pet}', 'destroy')->name('destroy');
        });
    Route::controller(FamilyMemberController::class)
        ->prefix('family-members')
        ->name('family-members.')
        ->middleware('module.enabled:Family Members')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{familyMember}/edit', 'edit')->name('edit');
            Route::put('{familyMember}', 'update')->name('update');
            Route::delete('{familyMember}', 'destroy')->name('destroy');
        });
    Route::controller(MoveRecordController::class)
        ->prefix('move-records')
        ->name('move-records.')
        ->middleware('module.enabled:Move Records')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{moveRecord}/edit', 'edit')->name('edit');
            Route::put('{moveRecord}', 'update')->name('update');
            Route::delete('{moveRecord}', 'destroy')->name('destroy');
        });
    Route::controller(BoomBarrierLogController::class)
        ->prefix('boom-barrier-logs')
        ->name('boom-barrier-logs.')
        ->middleware('module.enabled:Boom Barriers')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{boomBarrierLog}/edit', 'edit')->name('edit');
            Route::put('{boomBarrierLog}', 'update')->name('update');
            Route::delete('{boomBarrierLog}', 'destroy')->name('destroy');
        });
    Route::controller(VehicleController::class)
        ->prefix('vehicles')
        ->name('vehicles.')
        ->middleware('module.enabled:Vehicles')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{vehicle}/edit', 'edit')->name('edit');
            Route::put('{vehicle}', 'update')->name('update');
            Route::delete('{vehicle}', 'destroy')->name('destroy');
        });
    Route::controller(FixedDepositController::class)
        ->prefix('fixed-deposits')
        ->name('fixed-deposits.')
        ->middleware('module.enabled:Fixed Deposits')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{fixedDeposit}/edit', 'edit')->name('edit');
            Route::put('{fixedDeposit}', 'update')->name('update');
            Route::delete('{fixedDeposit}', 'destroy')->name('destroy');
        });
    Route::controller(PrepaidMeterController::class)
        ->prefix('prepaid-meters')
        ->name('prepaid-meters.')
        ->middleware('module.enabled:Prepaid Meters')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('{meter}/edit', 'edit')->name('edit');
            Route::put('{meter}', 'update')->name('update');
            Route::delete('{meter}', 'destroy')->name('destroy');
            Route::get('{meter}/readings', 'readings')->name('readings');
            Route::post('{meter}/readings', 'storeReading')->name('readings.store');
            Route::delete('{meter}/readings/{reading}', 'destroyReading')->name('readings.destroy');
        });

    Route::controller(EnergyController::class)
        ->prefix('energy')
        ->name('energy.')
        ->middleware('module.enabled:Energy')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('{meter}/topups', 'topups')->name('topups');
            Route::post('{meter}/topups', 'storeTopup')->name('topups.store');
            Route::delete('{meter}/topups/{topup}', 'destroyTopup')->name('topups.destroy');
        });

    Route::post('society/{society}/switch', SocietySwitchController::class)
        ->name('society.switch');
});

require __DIR__.'/settings.php';
require __DIR__.'/superadmin.php';
