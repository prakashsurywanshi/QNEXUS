<?php

namespace App\Http\Controllers;

use App\Models\Floor;
use App\Models\Tower;
use Inertia\Inertia;
use Inertia\Response;

class FloorController extends Controller
{
    public function index(int $towerId): Response
    {
        $tower = Tower::findOrFail($towerId);
        return Inertia::render('floors/index', ['tower' => $tower, 'floors' => Floor::where('tower_id', $towerId)->get(),
        ]);
    }
}

