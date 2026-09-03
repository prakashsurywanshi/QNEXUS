<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\SuperadminPaymentGateway;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GatewayController extends Controller
{
    /**
     * Show the payment gateway configuration.
     */
    public function index(): Response
    {
        $gateway = SuperadminPaymentGateway::first() ?? new SuperadminPaymentGateway;

        return Inertia::render('superadmin/gateways/index', [
            'gateway' => $gateway,
        ]);
    }

    /**
     * Persist the payment gateway configuration.
     */
    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'razorpay_type' => ['nullable', 'in:test,live'],
            'razorpay_status' => ['boolean'],
            'stripe_type' => ['nullable', 'in:test,live'],
            'stripe_status' => ['boolean'],
            'flutterwave_type' => ['nullable', 'in:test,live'],
            'flutterwave_status' => ['boolean'],
        ]);

        $gateway = SuperadminPaymentGateway::first();

        if ($gateway) {
            $gateway->update($data);
        } else {
            SuperadminPaymentGateway::create($data);
        }

        return redirect()->route('superadmin.gateways.index');
    }
}
