<?php

namespace App\Http\Controllers;

use App\Models\AssetManagement;
use Inertia\Inertia;
use Inertia\Response;

class AssetController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('assets/index', [
            'assets' => AssetManagement::get(),
        ]);
    }
}
