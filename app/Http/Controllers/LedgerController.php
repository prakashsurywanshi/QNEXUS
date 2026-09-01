<?php

namespace App\Http\Controllers;

use App\Models\GeneralLedger;
use Inertia\Inertia;
use Inertia\Response;

class LedgerController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('ledger/index', [
            'entries' => GeneralLedger::latest('date')->get(),
        ]);
    }
}
