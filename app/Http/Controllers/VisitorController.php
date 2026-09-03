<?php

namespace App\Http\Controllers;

use App\Models\ApartmentManagement;
use App\Models\AuditLog;
use App\Models\VisitorManagement;
use App\Models\VisitorTypeSettingsModel;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class VisitorController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('visitors/index', [
            'visitors' => VisitorManagement::with(['apartment', 'visitorType'])->latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('visitors/create', [
            'apartments' => ApartmentManagement::where('society_id', active_society_id())->orderBy('apartment_number')->get(['id', 'apartment_number']),
            'visitorTypes' => VisitorTypeSettingsModel::where('society_id', active_society_id())->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateVisitor($request);

        $this->persist(new VisitorManagement, $data, $request);

        AuditLog::record("Created visitor: {$data['visitor_name']}");

        return redirect()->route('visitors.index');
    }

    public function edit(VisitorManagement $visitor): Response
    {
        return Inertia::render('visitors/edit', [
            'visitor' => $visitor->load(['apartment', 'visitorType']),
            'apartments' => ApartmentManagement::where('society_id', active_society_id())->orderBy('apartment_number')->get(['id', 'apartment_number']),
            'visitorTypes' => VisitorTypeSettingsModel::where('society_id', active_society_id())->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, VisitorManagement $visitor): RedirectResponse
    {
        $this->persist($visitor, $this->validateVisitor($request), $request);

        AuditLog::record("Updated visitor: {$visitor->visitor_name}", $visitor);

        return redirect()->route('visitors.index');
    }

    public function destroy(VisitorManagement $visitor): RedirectResponse
    {
        AuditLog::record("Deleted visitor: {$visitor->visitor_name}");

        if ($visitor->visitor_photo) {
            Storage::disk('public')->delete($visitor->visitor_photo);
        }

        $visitor->delete();

        return redirect()->route('visitors.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function validateVisitor(Request $request): array
    {
        return $request->validate([
            'visitor_name' => ['required', 'string', 'max:255'],
            'phone_number' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:500'],
            'purpose_of_visit' => ['nullable', 'string', 'max:500'],
            'date_of_visit' => ['nullable', 'date'],
            'date_of_exit' => ['nullable', 'date'],
            'in_time' => ['nullable', 'date_format:H:i'],
            'out_time' => ['nullable', 'date_format:H:i'],
            'status' => ['required', Rule::in(['pending', 'allowed', 'not_allowed', 'checked_in', 'checked_out'])],
            'apartment_id' => ['nullable', 'exists:apartment_managements,id'],
            'visitor_type_id' => ['nullable', 'exists:visitor_settings,id'],
            'visitor_photo' => ['nullable', 'file', 'max:2048'],
            'id_proof_type' => ['nullable', 'string', 'max:255'],
            'id_proof_number' => ['nullable', 'string', 'max:255'],
        ]);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function persist(VisitorManagement $visitor, array $data, Request $request): void
    {
        $visitor->visitor_name = $data['visitor_name'];
        $visitor->phone_number = $data['phone_number'] ?? null;
        $visitor->address = $data['address'] ?? null;
        $visitor->purpose_of_visit = $data['purpose_of_visit'] ?? null;
        $visitor->date_of_visit = $data['date_of_visit'] ?? null;
        $visitor->date_of_exit = $data['date_of_exit'] ?? null;
        $visitor->in_time = $data['in_time'] ?? null;
        $visitor->out_time = $data['out_time'] ?? null;
        $visitor->status = $data['status'];
        $visitor->apartment_id = $data['apartment_id'] ?? null;
        $visitor->visitor_type_id = $data['visitor_type_id'] ?? null;
        $visitor->id_proof_type = $data['id_proof_type'] ?? null;
        $visitor->id_proof_number = $data['id_proof_number'] ?? null;
        $visitor->added_by = auth()->id() ? (int) auth()->id() : null;

        if (! $visitor->society_id && ! $visitor->exists) {
            $visitor->society_id = active_society_id();
        }

        if ($request->hasFile('visitor_photo')) {
            if ($visitor->visitor_photo) {
                Storage::disk('public')->delete($visitor->visitor_photo);
            }
            $path = $request->file('visitor_photo')->store('visitors-photos', 'public');
            $visitor->visitor_photo = $path !== false ? $path : null;
        }

        $visitor->save();
    }
}
