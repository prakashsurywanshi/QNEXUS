<?php

namespace App\Http\Controllers;

use App\Models\ApartmentManagement;
use App\Models\AuditLog;
use App\Models\Meter;
use App\Models\PrepaidMeterReading;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PrepaidMeterController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('finance/prepaid-meters/index', [
            'meters' => Meter::with(['apartment', 'readings'])->latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('finance/prepaid-meters/create', [
            'apartments' => ApartmentManagement::where('society_id', active_society_id())->orderBy('apartment_number')->get(['id', 'apartment_number']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateMeter($request);

        Meter::create([
            'society_id' => active_society_id(),
            'apartment_id' => $data['apartment_id'] ?? null,
            'meter_number' => $data['meter_number'] ?? null,
            'meter_type' => $data['meter_type'],
            'is_active' => $data['is_active'] ?? true,
        ]);

        AuditLog::record("Created meter: {$data['meter_number']}");

        return redirect()->route('prepaid-meters.index');
    }

    public function edit(Meter $meter): Response
    {
        return Inertia::render('finance/prepaid-meters/edit', [
            'meter' => $meter->load(['apartment', 'readings']),
            'apartments' => ApartmentManagement::where('society_id', active_society_id())->orderBy('apartment_number')->get(['id', 'apartment_number']),
        ]);
    }

    public function update(Request $request, Meter $meter): RedirectResponse
    {
        $data = $this->validateMeter($request);

        $meter->update([
            'apartment_id' => $data['apartment_id'] ?? null,
            'meter_number' => $data['meter_number'] ?? null,
            'meter_type' => $data['meter_type'],
            'is_active' => $data['is_active'] ?? true,
        ]);

        AuditLog::record("Updated meter: {$data['meter_number']}", $meter);

        return redirect()->route('prepaid-meters.index');
    }

    public function destroy(Meter $meter): RedirectResponse
    {
        AuditLog::record("Deleted meter: {$meter->meter_number}");
        $meter->delete();

        return redirect()->route('prepaid-meters.index');
    }

    public function readings(Meter $meter): Response
    {
        return Inertia::render('finance/prepaid-meters/readings', [
            'meter' => $meter->load(['apartment']),
            'readings' => $meter->readings()->with(['recorder'])->latest('reading_date')->get(),
        ]);
    }

    public function storeReading(Request $request, Meter $meter): RedirectResponse
    {
        $data = $request->validate([
            'current_reading' => ['required', 'numeric', 'min:0'],
            'amount' => ['nullable', 'numeric', 'min:0'],
            'balance' => ['nullable', 'numeric', 'min:0'],
            'reading_source' => ['nullable', 'string', 'max:255'],
            'reading_date' => ['required', 'date'],
        ]);

        $previous = (float) $meter->readings()->latest('reading_date')->value('current_reading') ?: 0;
        $current = (float) $data['current_reading'];
        $units = max(0, $current - $previous);

        PrepaidMeterReading::create([
            'society_id' => active_society_id(),
            'apartment_id' => $meter->apartment_id,
            'meter_id' => $meter->id,
            'previous_reading' => $previous,
            'current_reading' => $current,
            'units_consumed' => $units,
            'amount' => $data['amount'] ?? 0,
            'balance' => $data['balance'] ?? 0,
            'recorded_by' => auth()->id() ? (int) auth()->id() : null,
            'reading_source' => $data['reading_source'] ?? 'manual',
            'reading_date' => $data['reading_date'],
        ]);

        AuditLog::record("Recorded reading for meter: {$meter->meter_number}", $meter);

        return redirect()->route('prepaid-meters.readings', $meter);
    }

    public function destroyReading(Meter $meter, PrepaidMeterReading $reading): RedirectResponse
    {
        AuditLog::record("Deleted reading #{$reading->id} for meter {$meter->meter_number}");
        $reading->delete();

        return redirect()->route('prepaid-meters.readings', $meter);
    }

    /**
     * @return array<string, mixed>
     */
    private function validateMeter(Request $request): array
    {
        return $request->validate([
            'apartment_id' => ['nullable', 'exists:apartment_managements,id'],
            'meter_number' => ['nullable', 'string', 'max:255'],
            'meter_type' => ['required', 'string', 'max:255'],
            'is_active' => ['nullable', 'boolean'],
        ]);
    }
}
