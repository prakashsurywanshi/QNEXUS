<?php

namespace App\Http\Controllers;

use App\Models\Payment;
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
}
