<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\RoleAwareApiController;
use App\Models\ApartmentManagement;
use App\Models\MaintenanceApartment;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class FinanceController extends RoleAwareApiController
{
    public function dues(Request $request): JsonResponse
    {
        $society = $this->requireSociety();

        $apartmentIds = ApartmentManagement::where('society_id', $society->id)->pluck('id');

        $query = MaintenanceApartment::with('maintenanceManagement')
            ->whereIn('apartment_management_id', $apartmentIds);

        if ($this->roleIs(['Owner', 'Tenant'])) {
            $ownedApartmentIds = ApartmentManagement::where('society_id', $society->id)
                ->where('user_id', $this->authUser()->id)
                ->pluck('id');

            $query->whereIn('apartment_management_id', $ownedApartmentIds);
        }

        $items = $query->orderByDesc('id')
            ->paginate((int) $request->get('per_page', 15));

        return $this->paginated($items);
    }

    public function payments(Request $request): JsonResponse
    {
        $society = $this->requireSociety();

        $query = Payment::where('society_id', $society->id);

        if ($this->roleIs(['Owner', 'Tenant'])) {
            $apartmentIds = ApartmentManagement::where('society_id', $society->id)
                ->where('user_id', $this->authUser()->id)
                ->pluck('id');

            $maintenanceIds = MaintenanceApartment::whereIn('apartment_management_id', $apartmentIds)
                ->pluck('id');

            $query->whereIn('maintenance_apartment_id', $maintenanceIds);
        }

        $items = $query->orderByDesc('id')
            ->paginate((int) $request->get('per_page', 15));

        return $this->paginated($items);
    }

    public function pay(Request $request): JsonResponse
    {
        $society = $this->requireSociety();

        $validated = $request->validate([
            'maintenance_apartment_id' => 'required|integer|exists:maintenance_apartment,id',
            'amount' => 'required|numeric|min:0.01',
            'payment_method' => ['required', Rule::in(['cash', 'upi', 'card', 'stripe', 'razorpay', 'flutterwave'])],
            'transaction_id' => 'nullable|string|max:255',
        ]);

        $due = MaintenanceApartment::find($validated['maintenance_apartment_id']);

        if ($this->roleIs(['Owner', 'Tenant'])) {
            $ownedAptIds = ApartmentManagement::where('society_id', $society->id)
                ->where('user_id', $this->authUser()->id)
                ->pluck('id');

            if (! $ownedAptIds->contains($due->apartment_management_id)) {
                return $this->forbidden('You can only pay your own maintenance dues.');
            }
        }

        if ($due->paid_status === 'paid') {
            return $this->error('This due has already been paid.', 422);
        }

        $payment = Payment::create([
            'society_id' => $society->id,
            'maintenance_apartment_id' => $due->id,
            'payment_method' => $validated['payment_method'],
            'amount' => $validated['amount'],
            'balance' => max(0, (float) $due->cost - (float) $validated['amount']),
            'transaction_id' => $validated['transaction_id'] ?? null,
        ]);

        $due->update([
            'paid_status' => 'paid',
            'payment_date' => now()->toDateString(),
        ]);

        return $this->created($payment, 'Payment recorded');
    }
}
