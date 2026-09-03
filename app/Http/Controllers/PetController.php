<?php

namespace App\Http\Controllers;

use App\Models\ApartmentManagement;
use App\Models\AuditLog;
use App\Models\Pet;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PetController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('pets/index', [
            'pets' => Pet::with(['user', 'apartment'])->latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('pets/create', [
            'users' => User::where('society_id', active_society_id())->orderBy('name')->get(['id', 'name']),
            'apartments' => ApartmentManagement::where('society_id', active_society_id())->orderBy('apartment_number')->get(['id', 'apartment_number']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validatePet($request);

        Pet::create([
            'society_id' => active_society_id(),
            'user_id' => $data['user_id'],
            'apartment_id' => $data['apartment_id'] ?? null,
            'name' => $data['name'],
            'species' => $data['species'],
            'breed' => $data['breed'] ?? null,
            'color' => $data['color'] ?? null,
            'weight' => $data['weight'] ?? null,
            'vaccination_status' => $data['vaccination_status'],
            'last_vaccination_date' => $data['last_vaccination_date'] ?? null,
            'next_vaccination_date' => $data['next_vaccination_date'] ?? null,
            'is_neutered' => $data['is_neutered'] ?? false,
            'microchip_id' => $data['microchip_id'] ?? null,
            'notes' => $data['notes'] ?? null,
        ]);

        AuditLog::record("Registered pet: {$data['name']}");

        return redirect()->route('pets.index');
    }

    public function edit(Pet $pet): Response
    {
        return Inertia::render('pets/edit', [
            'pet' => $pet->load(['user', 'apartment']),
            'users' => User::where('society_id', active_society_id())->orderBy('name')->get(['id', 'name']),
            'apartments' => ApartmentManagement::where('society_id', active_society_id())->orderBy('apartment_number')->get(['id', 'apartment_number']),
        ]);
    }

    public function update(Request $request, Pet $pet): RedirectResponse
    {
        $data = $this->validatePet($request);

        $pet->update([
            'user_id' => $data['user_id'],
            'apartment_id' => $data['apartment_id'] ?? null,
            'name' => $data['name'],
            'species' => $data['species'],
            'breed' => $data['breed'] ?? null,
            'color' => $data['color'] ?? null,
            'weight' => $data['weight'] ?? null,
            'vaccination_status' => $data['vaccination_status'],
            'last_vaccination_date' => $data['last_vaccination_date'] ?? null,
            'next_vaccination_date' => $data['next_vaccination_date'] ?? null,
            'is_neutered' => $data['is_neutered'] ?? false,
            'microchip_id' => $data['microchip_id'] ?? null,
            'notes' => $data['notes'] ?? null,
        ]);

        AuditLog::record("Updated pet: {$data['name']}", $pet);

        return redirect()->route('pets.index');
    }

    public function destroy(Pet $pet): RedirectResponse
    {
        AuditLog::record("Removed pet: {$pet->name}");
        $pet->delete();

        return redirect()->route('pets.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function validatePet(Request $request): array
    {
        return $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'apartment_id' => ['nullable', 'exists:apartment_managements,id'],
            'name' => ['required', 'string', 'max:255'],
            'species' => ['required', 'string', 'max:255'],
            'breed' => ['nullable', 'string', 'max:255'],
            'color' => ['nullable', 'string', 'max:255'],
            'weight' => ['nullable', 'numeric', 'min:0'],
            'vaccination_status' => ['required', Rule::in(['up_to_date', 'overdue', 'unknown'])],
            'last_vaccination_date' => ['nullable', 'date'],
            'next_vaccination_date' => ['nullable', 'date'],
            'is_neutered' => ['nullable', 'boolean'],
            'microchip_id' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
        ]);
    }
}
