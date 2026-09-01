<?php

namespace App\Http\Controllers;

use App\Models\Apartment;
use Inertia\Inertia;
use Inertia\Response;

class ApartmentController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('apartments/index', [
            'apartments' => Apartment::get(),
        ]);
    }
}
