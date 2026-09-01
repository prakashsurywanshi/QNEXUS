<?php

namespace App\Http\Controllers;

use App\Models\Gatepass;
use Inertia\Inertia;
use Inertia\Response;

class GatepassController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('gatepasses/index', [
            'gatepasses' => Gatepass::get(),
        ]);
    }
}
