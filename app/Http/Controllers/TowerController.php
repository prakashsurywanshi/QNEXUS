<?php

namespace App\Http\Controllers;

use App\Models\Tower;
use Inertia\Inertia;
use Inertia\Response;

class TowerController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('towers/index', [
            'towers' => Tower::with('floors')->get(),
        ]);
    }

    public function show(int $id): Response
    {
        $tower = Tower::with('floors')->findOrFail($id);

        return Inertia::render('towers/show', [
            'tower' => $tower,
        ]);
    }
}
