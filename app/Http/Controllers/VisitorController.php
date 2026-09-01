<?php

namespace App\Http\Controllers;

use App\Models\VisitorManagement;
use Inertia\Inertia;
use Inertia\Response;

class VisitorController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('visitors/index', [
            'visitors' => VisitorManagement::get(),
        ]);
    }
}
