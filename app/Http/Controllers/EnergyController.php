<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Meter;
use App\Models\MeterTopup;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class EnergyController extends Controller
{
    public function index(): Response
    {
        $societyId = active_society_id();
        $meters = Meter::with(['apartment', 'readings', 'topups'])->where('society_id', $societyId)->latest()->get();

        $rows = [];
        foreach ($meters as $meter) {
            $latest = $meter->readings()->latest('reading_date')->first();
            $totalTopups = (float) $meter->topups()->sum('amount');
            $balance = $latest ? (float) $latest->balance + $totalTopups : $totalTopups;

            $rows[] = [
                'id' => $meter->id,
                'meter_number' => $meter->meter_number,
                'meter_type' => $meter->meter_type,
                'is_active' => $meter->is_active,
                'apartment' => $meter->apartment ? ['id' => $meter->apartment->id, 'apartment_number' => $meter->apartment->apartment_number] : null,
                'current_reading' => $latest ? (float) $latest->current_reading : 0,
                'units_consumed' => $latest ? (float) $latest->units_consumed : 0,
                'balance' => $balance,
                'last_reading_date' => $latest ? optional($latest->reading_date)->toDateString() : null,
                'low_credit' => $balance < 500,
            ];
        }

        $totalUsage = array_sum(array_column($rows, 'units_consumed'));
        $totalTopups = (float) MeterTopup::where('society_id', $societyId)->sum('amount');
        $totalMeters = count($rows);
        $lowCredit = count(array_filter($rows, fn ($r) => $r['low_credit']));
        $inactive = count(array_filter($rows, fn ($r) => ! $r['is_active']));

        return Inertia::render('energy/index', [
            'meters' => $rows,
            'totals' => [
                'total_meters' => $totalMeters,
                'total_usage' => round($totalUsage, 4),
                'total_topups' => round($totalTopups, 2),
                'low_credit' => $lowCredit,
                'inactive' => $inactive,
            ],
        ]);
    }

    public function topups(Meter $meter): Response
    {
        return Inertia::render('energy/topups', [
            'meter' => $meter->load('apartment'),
            'topups' => $meter->topups()->with('recorder')->latest('topup_date')->get(),
        ]);
    }

    public function storeTopup(Request $request, Meter $meter): RedirectResponse
    {
        $data = $request->validate([
            'amount' => ['required', 'numeric', 'min:0.01'],
            'token' => ['nullable', 'string', 'max:255'],
            'payment_method' => ['required', Rule::in(['cash', 'upi', 'card'])],
            'topup_date' => ['required', 'date'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        MeterTopup::create([
            'society_id' => active_society_id(),
            'meter_id' => $meter->id,
            'apartment_id' => $meter->apartment_id,
            'amount' => $data['amount'],
            'token' => $data['token'] ?? null,
            'payment_method' => $data['payment_method'],
            'topup_date' => $data['topup_date'],
            'recorded_by' => auth()->id() ? (int) auth()->id() : null,
            'notes' => $data['notes'] ?? null,
        ]);

        AuditLog::record("Recorded ₹{$data['amount']} topup for meter: {$meter->meter_number}", $meter);

        return redirect()->route('energy.topups', $meter);
    }

    public function destroyTopup(Meter $meter, MeterTopup $topup): RedirectResponse
    {
        AuditLog::record("Deleted topup #{$topup->id} for meter {$meter->meter_number}");

        $topup->delete();

        return redirect()->route('energy.topups', $meter);
    }
}
