<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\RoleAwareApiController;
use App\Models\Apartment;
use App\Models\MaintenanceApartment;
use App\Models\MaintenanceManagement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MaintenanceController extends RoleAwareApiController
{
    public function index(Request $request): JsonResponse
    {
        $society = $this->requireSociety();

        $query = MaintenanceManagement::where('society_id', $society->id);

        if ($this->roleIs(['Owner', 'Tenant'])) {
            $apartmentIds = Apartment::where('society_id', $society->id)
                ->where('user_id', $this->authUser()->id)
                ->pluck('id');

            $managedIds = MaintenanceManagement::where('society_id', $society->id)->pluck('id');

            $billed = MaintenanceApartment::whereIn('apartment_management_id', $apartmentIds)
                ->get()
                ->pluck('maintenance_management_id');

            return $this->success(
                MaintenanceManagement::whereIn('id', $billed->merge($managedIds->take(0)))->get(),
                'My maintenance fetched'
            );
        }

        $items = $query->orderByDesc('id')->paginate($request->get('per_page', 15));

        return $this->paginated($items);
    }
}
