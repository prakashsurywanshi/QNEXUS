<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\EmergencyContact;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmergencyContactController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('emergency-contacts/index', [
            'contacts' => EmergencyContact::latest()->get(),
            'categories' => ['police', 'fire', 'ambulance', 'hospital', 'gas_leak', 'electrician', 'plumber', 'other'],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('emergency-contacts/create', [
            'categories' => ['police', 'fire', 'ambulance', 'hospital', 'gas_leak', 'electrician', 'plumber', 'other'],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:255'],
            'category' => ['required', 'in:police,fire,ambulance,hospital,gas_leak,electrician,plumber,other'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        EmergencyContact::create([
            'society_id' => active_society_id(),
            'name' => $data['name'],
            'phone' => $data['phone'],
            'category' => $data['category'],
            'is_active' => $data['is_active'] ?? true,
        ]);

        AuditLog::record("Added emergency contact: {$data['name']}");

        return redirect()->route('emergency-contacts.index');
    }

    public function edit(EmergencyContact $contact): Response
    {
        return Inertia::render('emergency-contacts/edit', [
            'contact' => $contact,
            'categories' => ['police', 'fire', 'ambulance', 'hospital', 'gas_leak', 'electrician', 'plumber', 'other'],
        ]);
    }

    public function update(Request $request, EmergencyContact $contact): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:255'],
            'category' => ['required', 'in:police,fire,ambulance,hospital,gas_leak,electrician,plumber,other'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $contact->update([
            'name' => $data['name'],
            'phone' => $data['phone'],
            'category' => $data['category'],
            'is_active' => $data['is_active'] ?? true,
        ]);

        AuditLog::record("Updated emergency contact: {$data['name']}", $contact);

        return redirect()->route('emergency-contacts.index');
    }

    public function destroy(EmergencyContact $contact): RedirectResponse
    {
        AuditLog::record("Deleted emergency contact: {$contact->name}");
        $contact->delete();

        return redirect()->route('emergency-contacts.index');
    }
}
