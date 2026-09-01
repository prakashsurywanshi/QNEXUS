<?php

namespace App\Http\Controllers;

use App\Models\PatrolCheckpoint;
use Inertia\Inertia;
use Inertia\Response;

class PatrolController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('patrol/index', [
            'checkpoints' => PatrolCheckpoint::get(),
        ]);
    }
}
