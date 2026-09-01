<?php

namespace App\Http\Controllers;

use App\Models\AssetManagement;
use App\Models\AssetsCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
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

    public function create(): Response
    {
        return Inertia::render('assets/create', [
            'categories' => AssetsCategory::get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateAsset($request);

        AssetManagement::create($data + ['society_id' => active_society_id()]);

        return redirect()->route('assets.index');
    }

    public function edit(AssetManagement $asset): Response
    {
        return Inertia::render('assets/edit', [
            'asset' => $asset,
            'categories' => AssetsCategory::get(['id', 'name']),
        ]);
    }

    public function update(Request $request, AssetManagement $asset): RedirectResponse
    {
        $asset->update($this->validateAsset($request));

        return redirect()->route('assets.index');
    }

    public function destroy(AssetManagement $asset): RedirectResponse
    {
        $asset->delete();

        return redirect()->route('assets.index');
    }

    private function validateAsset(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category_id' => ['nullable', 'integer', 'exists:asset_categories,id'],
            'location' => ['nullable', 'string', 'max:255'],
            'condition' => ['nullable', 'string', 'max:255'],
            'purchase_date' => ['nullable', 'date'],
            'maintenance_schedule' => ['nullable', Rule::in(['weekly', 'biweekly', 'monthly', 'half-year', 'yearly'])],
        ]);
    }
}
