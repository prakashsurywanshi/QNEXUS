<?php

namespace App\Http\Controllers;

use App\Models\Society;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Member-facing society settings. A society's own Admin/Manager may view and
 * update their own society's profile. Creating, deleting or targeting other
 * societies remains a platform-level (superadmin) responsibility.
 */
class SocietyAdminController extends Controller
{
    public function index(): Response
    {
        $this->ensureSocietyManager();

        $societyId = active_society_id();

        $society = Society::whereKey($societyId)->first();

        return Inertia::render('societies/index', [
            'society' => $society,
        ]);
    }

    public function edit(Society $society): Response
    {
        $this->ensureSocietyManager($society);

        return Inertia::render('societies/edit', [
            'society' => $society,
        ]);
    }

    public function update(Request $request, Society $society): RedirectResponse
    {
        $this->ensureSocietyManager($society);

        $data = $this->validateSociety($request);

        if ($request->hasFile('logo')) {
            $data['logo'] = $this->storeLogo($request, $society);
        }

        $society->update($data);

        return redirect()->route('societies.index');
    }

    /**
     * Store the uploaded society logo and delete any previously uploaded one.
     */
    private function storeLogo(Request $request, Society $society): string
    {
        if ($society->logo) {
            Storage::disk('public')->delete($society->logo);
        }

        $path = $request->file('logo')->store('logo', 'public');

        if ($path === false) {
            abort(500, 'Failed to store the uploaded logo.');
        }

        return $path;
    }

    /**
     * @return array<string, mixed>
     */
    private function validateSociety(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email'],
            'phone_number' => ['nullable', 'string', 'max:20'],
            'timezone' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string'],
            'property_type' => ['required', Rule::in(['residential', 'commercial', 'mixed'])],
            'show_logo_text' => ['boolean'],
            'logo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,svg,webp', 'max:2048'],
            'theme_hex' => ['nullable', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'theme_rgb' => ['nullable', 'string', 'max:64'],
        ]);
    }

    /**
     * Restrict the society-settings module to a society's own Admin/Manager
     * and to the society they are active in.
     */
    private function ensureSocietyManager(?Society $target = null): void
    {
        $role = isRole();

        abort_if(! in_array($role, ['Admin', 'Manager'], true) || is_superadmin(), 403, 'Society settings access only.');

        if ($target !== null && $target->id !== active_society_id()) {
            abort(403, 'You may only manage your own society.');
        }
    }
}
