<?php

namespace App\Http\Controllers;

use App\Models\ServiceClockInOut;
use Inertia\Inertia;
use Inertia\Response;

class ServiceClockController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('service-log/index', [
            'clocks' => ServiceClockInOut::get(),
        ]);
    }
}
