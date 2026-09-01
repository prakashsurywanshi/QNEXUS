<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Vendor;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class VendorController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('vendors/index', [
            'vendors' => Vendor::get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('vendors/create');
    }

    public function store(Request $request): RedirectResponse
    {
        Vendor::create($this->validateVendor($request) + [
            'society_id' => active_society_id(),
        ]);

        return redirect()->route('vendors.index');
    }

    public function edit(Vendor $vendor): Response
    {
        return Inertia::render('vendors/edit', [
            'vendor' => $vendor,
        ]);
    }

    public function update(Request $request, Vendor $vendor): RedirectResponse
    {
        $vendor->update($this->validateVendor($request));

        return redirect()->route('vendors.index');
    }

    public function destroy(Vendor $vendor): RedirectResponse
    {
        $vendor->delete();

        return redirect()->route('vendors.index');
    }

    private function validateVendor(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'contact_person' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'email' => ['nullable', 'email'],
            'category' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string'],
            'status' => ['required', Rule::in(['active', 'inactive'])],
        ]);
    }
}
