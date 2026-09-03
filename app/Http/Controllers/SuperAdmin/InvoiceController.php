<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\GlobalInvoice;
use Inertia\Inertia;
use Inertia\Response;

class InvoiceController extends Controller
{
    /**
     * List all global invoices across the platform.
     */
    public function index(): Response
    {
        $invoices = GlobalInvoice::with(['society:id,name', 'package:id,package_name'])
            ->latest('id')
            ->get();

        return Inertia::render('superadmin/invoices/index', [
            'invoices' => $invoices,
        ]);
    }
}
