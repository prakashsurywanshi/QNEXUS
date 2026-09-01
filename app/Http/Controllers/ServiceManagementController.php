<?php

namespace App\Http\Controllers;

use App\Models\ServiceManagement;
use Inertia\Inertia;
use Inertia\Response;

class ServiceManagementController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('service-management/index', [
            'services' => ServiceManagement::get(),
        ]);
    }
}
