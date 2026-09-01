<?php

namespace App\Http\Controllers;

use App\Models\Society;
use Inertia\Inertia;
use Inertia\Response;

class SocietyAdminController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('societies/index', [
            'societies' => Society::get(),
        ]);
    }
}
