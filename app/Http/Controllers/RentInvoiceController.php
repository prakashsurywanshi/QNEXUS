<?php

namespace App\Http\Controllers;

use App\Models\RentInvoice;
use Inertia\Inertia;
use Inertia\Response;

class RentInvoiceController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('invoices/index', [
            'invoices' => RentInvoice::get(),
        ]);
    }
}
