<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Enums\PackageType;
use App\Http\Controllers\Controller;
use App\Models\GlobalCurrency;
use App\Models\Module;
use App\Models\Package;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PackageController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('superadmin/packages/index', [
            'packages' => Package::with(['modules', 'currency'])
                ->orderByDesc('id')
                ->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('superadmin/packages/create', [
            'currencies' => GlobalCurrency::get(['id', 'currency_name', 'currency_code', 'currency_symbol']),
            'modules' => $this->moduleOptions(),
            'packageTypes' => PackageType::cases(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validatePackage($request);

        $package = Package::create($data);

        $package->modules()->sync($data['module_ids'] ?? []);

        return redirect()->route('superadmin.packages.index')->with('toast', [
            'type' => 'success',
            'message' => 'Package created.',
        ]);
    }

    public function edit(Package $package): Response
    {
        return Inertia::render('superadmin/packages/edit', [
            'package' => $package->load('modules'),
            'currencies' => GlobalCurrency::get(['id', 'currency_name', 'currency_code', 'currency_symbol']),
            'modules' => $this->moduleOptions(),
            'packageTypes' => PackageType::cases(),
        ]);
    }

    public function update(Request $request, Package $package): RedirectResponse
    {
        $data = $this->validatePackage($request);

        $package->update($data);
        $package->modules()->sync($data['module_ids'] ?? []);

        return redirect()->route('superadmin.packages.index')->with('toast', [
            'type' => 'success',
            'message' => 'Package updated.',
        ]);
    }

    public function destroy(Package $package): RedirectResponse
    {
        $package->delete();

        return redirect()->route('superadmin.packages.index')->with('toast', [
            'type' => 'success',
            'message' => 'Package deleted.',
        ]);
    }

    /**
     * @return array{ id: int, name: string }[]
     */
    private function moduleOptions(): array
    {
        return Module::orderBy('name')
            ->get(['id', 'name'])
            ->map(fn (Module $module) => ['id' => $module->id, 'name' => $module->name])
            ->all();
    }

    /**
     * @return array<string, mixed>
     */
    private function validatePackage(Request $request): array
    {
        $data = $request->validate([
            'package_name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'currency_id' => ['required', 'integer', 'exists:global_currencies,id'],
            'annual_price' => ['nullable', 'numeric', 'min:0'],
            'monthly_price' => ['nullable', 'numeric', 'min:0'],
            'is_recommended' => ['boolean'],
            'is_private' => ['boolean'],
            'is_free' => ['boolean'],
            'package_type' => ['required', 'string', 'in:'.implode(',', array_column(PackageType::cases(), 'value'))],
            'trial_days' => ['nullable', 'integer', 'min:0'],
            'module_ids' => ['nullable', 'array'],
            'module_ids.*' => ['integer'],
        ]);

        $data['module_ids'] = $data['module_ids'] ?? [];

        return $data;
    }
}
