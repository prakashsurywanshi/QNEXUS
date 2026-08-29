<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\RoleAwareApiController;
use App\Models\AmenityBooking;
use App\Models\Apartment;
use App\Models\DailyHelpBooking;
use App\Models\Notice;
use App\Models\Ticket;
use App\Models\VisitorManagement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends RoleAwareApiController
{
    public function index(Request $request): JsonResponse
    {
        $society = $this->requireSociety();
        $userId = $this->authUser()->id;
        $role = $this->roleName();

        $data = [
            'society' => [
                'id' => $society->id,
                'name' => $society->name,
                'slug' => $society->slug,
                'property_type' => $society->property_type,
            ],
            'role' => $role,
            'user' => [
                'id' => $this->authUser()->id,
                'name' => $this->authUser()->name,
                'email' => $this->authUser()->email,
            ],
        ];

        $baseSociety = ['society_id' => $society->id];

        switch ($role) {
            case 'Admin':
            case 'Manager':
                $data['counts'] = [
                    'residents' => Apartment::where($baseSociety)->count(),
                    'open_tickets' => Ticket::where($baseSociety)->where('status', '!=', 'closed')->count(),
                    'active_visitors' => VisitorManagement::where($baseSociety)->where('status', 'active')->count(),
                    'amenity_bookings' => AmenityBooking::where($baseSociety)->count(),
                    'notices' => Notice::where($baseSociety)->count(),
                    'daily_help_bookings' => DailyHelpBooking::where($baseSociety)->count(),
                ];
                break;

            case 'Owner':
            case 'Tenant':
                $data['counts'] = [
                    'my_tickets' => Ticket::where($baseSociety)->where('created_by', $userId)->orWhere('user_id', $userId)->count(),
                    'my_amenity_bookings' => AmenityBooking::where($baseSociety)->where('booked_by', $userId)->count(),
                    'notices' => Notice::where($baseSociety)->count(),
                ];
                break;

            case 'Guard':
                $data['counts'] = [
                    'checkins_today' => VisitorManagement::where($baseSociety)
                        ->whereDate('created_at', now()->toDateString())
                        ->count(),
                    'open_tickets' => Ticket::where($baseSociety)->where('status', '!=', 'closed')->count(),
                ];
                break;
        }

        return $this->success($data, 'Dashboard loaded');
    }
}
