<?php

namespace App\Http\Controllers;

use App\Models\Amenity;
use Inertia\Inertia;
use Inertia\Response;

class AmenityController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('amenities/index', [
            'amenities' => Amenity::get(),
        ]);
    }
}
