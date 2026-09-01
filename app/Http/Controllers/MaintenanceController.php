<?php

namespace App\Http\Controllers;

use App\Models\Maintenance;
use Inertia\Inertia;
use Inertia\Response;

class MaintenanceController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('maintenance/index', [
            'maintenance' => Maintenance::get(),
        ]);
    }
}
