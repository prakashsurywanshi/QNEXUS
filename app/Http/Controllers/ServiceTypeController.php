<?php

namespace App\Http\Controllers;

use App\Models\ServiceType;
use Inertia\Inertia;
use Inertia\Response;

class ServiceTypeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('service-types/index', [
            'serviceTypes' => ServiceType::get(),
        ]);
    }
}
