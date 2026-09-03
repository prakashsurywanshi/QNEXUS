<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\FamilyMember;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FamilyMemberController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('family-members/index', [
            'familyMembers' => FamilyMember::with('user')->latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('family-members/create', [
            'users' => User::where('society_id', active_society_id())->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateMember($request);

        FamilyMember::create([
            'society_id' => active_society_id(),
            'user_id' => $data['user_id'],
            'name' => $data['name'],
            'relationship' => $data['relationship'] ?? null,
            'phone' => $data['phone'] ?? null,
            'document_type' => $data['document_type'] ?? null,
            'document' => $data['document'] ?? null,
        ]);

        AuditLog::record("Added family member: {$data['name']}");

        return redirect()->route('family-members.index');
    }

    public function edit(FamilyMember $familyMember): Response
    {
        return Inertia::render('family-members/edit', [
            'familyMember' => $familyMember->load('user'),
            'users' => User::where('society_id', active_society_id())->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, FamilyMember $familyMember): RedirectResponse
    {
        $data = $this->validateMember($request);

        $familyMember->update([
            'user_id' => $data['user_id'],
            'name' => $data['name'],
            'relationship' => $data['relationship'] ?? null,
            'phone' => $data['phone'] ?? null,
            'document_type' => $data['document_type'] ?? null,
            'document' => $data['document'] ?? null,
        ]);

        AuditLog::record("Updated family member: {$data['name']}", $familyMember);

        return redirect()->route('family-members.index');
    }

    public function destroy(FamilyMember $familyMember): RedirectResponse
    {
        $familyMember->delete();

        AuditLog::record("Removed family member: {$familyMember->name}", $familyMember);

        return redirect()->route('family-members.index');
    }

    /**
     * @return array<string, mixed>
     */
    protected function validateMember(Request $request): array
    {
        return $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'name' => ['required', 'string', 'max:255'],
            'relationship' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
            'document_type' => ['nullable', 'string', 'max:255'],
            'document' => ['nullable', 'string', 'max:255'],
        ]);
    }
}
