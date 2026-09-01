<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\MaintenanceApartment;
use App\Models\Payment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('payments/index', [
            'payments' => Payment::get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('payments/create', [
            'maintenanceApartments' => MaintenanceApartment::with('apartment:id,apartment_number')->get(['id', 'apartment_management_id']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Payment::create($this->validatePayment($request) + [
            'society_id' => active_society_id(),
        ]);

        return redirect()->route('payments.index');
    }

    public function edit(Payment $payment): Response
    {
        return Inertia::render('payments/edit', [
            'payment' => $payment,
            'maintenanceApartments' => MaintenanceApartment::with('apartment:id,apartment_number')->get(['id', 'apartment_management_id']),
        ]);
    }

    public function update(Request $request, Payment $payment): RedirectResponse
    {
        $payment->update($this->validatePayment($request));

        return redirect()->route('payments.index');
    }

    public function destroy(Payment $payment): RedirectResponse
    {
        $payment->delete();

        return redirect()->route('payments.index');
    }

    private function validatePayment(Request $request): array
    {
        return $request->validate([
            'maintenance_apartment_id' => ['required', 'integer', 'exists:maintenance_apartment,id'],
            'payment_method' => ['required', Rule::in(['cash', 'upi', 'card', 'due', 'stripe', 'razorpay', 'flutterwave'])],
            'amount' => ['required', 'numeric', 'min:0'],
            'balance' => ['nullable', 'numeric', 'min:0'],
            'transaction_id' => ['nullable', 'string', 'max:255'],
        ]);
    }
}
