<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Budget;
use App\Models\ChartOfAccount;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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

    public function create(): Response
    {
        return Inertia::render('budgets/create', [
            'accounts' => ChartOfAccount::get(['id', 'account_name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Budget::create($this->validateBudget($request) + [
            'society_id' => active_society_id(),
        ]);

        return redirect()->route('budgets.index');
    }

    public function edit(Budget $budget): Response
    {
        return Inertia::render('budgets/edit', [
            'budget' => $budget,
            'accounts' => ChartOfAccount::get(['id', 'account_name']),
        ]);
    }

    public function update(Request $request, Budget $budget): RedirectResponse
    {
        $budget->update($this->validateBudget($request));

        return redirect()->route('budgets.index');
    }

    public function destroy(Budget $budget): RedirectResponse
    {
        $budget->delete();

        return redirect()->route('budgets.index');
    }

    private function validateBudget(Request $request): array
    {
        return $request->validate([
            'fiscal_year' => ['required', 'string', 'max:255'],
            'account_id' => ['required', 'integer', 'exists:chart_of_accounts,id'],
            'budgeted_amount' => ['required', 'numeric', 'min:0'],
            'actual_amount' => ['nullable', 'numeric', 'min:0'],
        ]);
    }
}
