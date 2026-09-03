<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\V1\AmenityBookingController;
use App\Http\Controllers\Api\V1\CommunityController;
use App\Http\Controllers\Api\V1\DailyHelpController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\FinanceController;
use App\Http\Controllers\Api\V1\GatepassController;
use App\Http\Controllers\Api\V1\MaintenanceController;
use App\Http\Controllers\Api\V1\NoticeController;
use App\Http\Controllers\Api\V1\ServiceRequestController;
use App\Http\Controllers\Api\V1\SosAlertController;
use App\Http\Controllers\Api\V1\TicketController;
use App\Http\Controllers\Api\V1\VisitorController;
use App\Http\Controllers\Api\V1\VisitorPreapprovalController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('v1')->group(function () {

    // Public routes
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    // Authenticated routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
        Route::get('/profile', [AuthController::class, 'profile']);

        // Role-aware mobile endpoints (all 5 roles)
        Route::get('/dashboard', [DashboardController::class, 'index']);

        Route::get('/amenities', [AmenityBookingController::class, 'amenities']);
        Route::post('/amenity-bookings', [AmenityBookingController::class, 'store']);
        Route::get('/my-amenity-bookings', [AmenityBookingController::class, 'myBookings']);

        Route::get('/tickets', [TicketController::class, 'index']);
        Route::post('/tickets', [TicketController::class, 'store']);
        Route::get('/tickets/{ticket}', [TicketController::class, 'show']);
        Route::patch('/tickets/{ticket}/status', [TicketController::class, 'updateStatus']);
        Route::post('/tickets/{ticket}/reply', [TicketController::class, 'reply']);

        Route::get('/visitors', [VisitorController::class, 'index']);
        Route::post('/visitors/checkin', [VisitorController::class, 'checkin']);
        Route::post('/visitors/{visitor}/checkout', [VisitorController::class, 'checkout']);

        Route::get('/notices', [NoticeController::class, 'index']);
        Route::post('/notices', [NoticeController::class, 'store']);

        Route::get('/maintenance', [MaintenanceController::class, 'index']);

        Route::post('/sos', [SosAlertController::class, 'store']);

        // Service requests
        Route::get('/service-requests', [ServiceRequestController::class, 'index']);
        Route::post('/service-requests', [ServiceRequestController::class, 'store']);
        Route::get('/service-requests/{id}', [ServiceRequestController::class, 'show']);
        Route::post('/service-requests/{id}/reply', [ServiceRequestController::class, 'reply']);
        Route::post('/service-requests/{id}/quote', [ServiceRequestController::class, 'quote']);
        Route::patch('/service-requests/{id}/advance', [ServiceRequestController::class, 'advance']);

        // Gate passes
        Route::get('/gatepasses', [GatepassController::class, 'index']);

        // Visitor pre-approvals
        Route::get('/visitor-preapprovals', [VisitorPreapprovalController::class, 'index']);
        Route::post('/visitor-preapprovals', [VisitorPreapprovalController::class, 'store']);

        // Community: events, polls, meetings
        Route::get('/events', [CommunityController::class, 'events']);
        Route::post('/events/{id}/rsvp', [CommunityController::class, 'rsvp']);
        Route::get('/polls', [CommunityController::class, 'polls']);
        Route::post('/polls/{id}/vote', [CommunityController::class, 'vote']);
        Route::get('/meetings', [CommunityController::class, 'meetings']);
        Route::post('/meetings/{id}/attend', [CommunityController::class, 'attend']);

        // Finance: maintenance dues + payments
        Route::get('/maintenance-dues', [FinanceController::class, 'dues']);
        Route::get('/payments', [FinanceController::class, 'payments']);
        Route::post('/payments', [FinanceController::class, 'pay']);

        // Daily help
        Route::get('/daily-help/workers', [DailyHelpController::class, 'workers']);
        Route::post('/daily-help/bookings', [DailyHelpController::class, 'book']);
        Route::get('/my-daily-help-bookings', [DailyHelpController::class, 'myBookings']);
    });
});
