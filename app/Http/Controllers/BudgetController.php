<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use Inertia\Inertia;
use Inertia\Response;

class BudgetController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('budgets/index', [
            'budgets' => Budget::get(),
        ]);
    }
}
