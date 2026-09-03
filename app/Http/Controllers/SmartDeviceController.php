<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\SmartDevice;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SmartDeviceController extends Controller
{
    public const DEVICE_TYPES = [
        'cctv', 'access_control', 'rfid', 'anpr', 'boom_barrier',
        'smart_meter', 'elevator', 'fire_system', 'hvac', 'ev_charger', 'iot_sensor',
    ];

    public const STATUSES = ['online', 'offline', 'maintenance', 'disabled'];

    public function index(): Response
    {
        $societyId = active_society_id();
        $devices = SmartDevice::where('society_id', $societyId)->latest()->get();

        $summary = [];
        foreach (self::DEVICE_TYPES as $type) {
            $summary[$type] = $devices->where('device_type', $type)->count();
        }

        return Inertia::render('smart-building/index', [
            'devices' => $devices,
            'deviceTypes' => self::DEVICE_TYPES,
            'statuses' => self::STATUSES,
            'summary' => $summary,
            'totals' => [
                'total' => $devices->count(),
                'online' => $devices->where('status', 'online')->count(),
                'offline' => $devices->where('status', 'offline')->count(),
                'maintenance' => $devices->where('status', 'maintenance')->count(),
                'connected' => $devices->where('connected', true)->count(),
                'disconnected' => $devices->where('connected', false)->count(),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('smart-building/create', [
            'deviceTypes' => self::DEVICE_TYPES,
            'statuses' => self::STATUSES,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateDevice($request);

        SmartDevice::create([
            'society_id' => active_society_id(),
            'device_name' => $data['device_name'],
            'device_type' => $data['device_type'],
            'location' => $data['location'] ?? null,
            'vendor' => $data['vendor'] ?? null,
            'model' => $data['model'] ?? null,
            'serial_number' => $data['serial_number'] ?? null,
            'ip_address' => $data['ip_address'] ?? null,
            'status' => $data['status'],
            'connected' => $data['connected'] ?? true,
            'last_seen_at' => ($data['connected'] ?? true) ? now() : null,
            'notes' => $data['notes'] ?? null,
        ]);

        AuditLog::record("Registered smart device: {$data['device_name']}");

        return redirect()->route('smart-devices.index');
    }

    public function edit(SmartDevice $smartDevice): Response
    {
        return Inertia::render('smart-building/edit', [
            'smartDevice' => $smartDevice,
            'deviceTypes' => self::DEVICE_TYPES,
            'statuses' => self::STATUSES,
        ]);
    }

    public function update(Request $request, SmartDevice $smartDevice): RedirectResponse
    {
        $data = $this->validateDevice($request);

        $smartDevice->update([
            'device_name' => $data['device_name'],
            'device_type' => $data['device_type'],
            'location' => $data['location'] ?? null,
            'vendor' => $data['vendor'] ?? null,
            'model' => $data['model'] ?? null,
            'serial_number' => $data['serial_number'] ?? null,
            'ip_address' => $data['ip_address'] ?? null,
            'status' => $data['status'],
            'connected' => $data['connected'] ?? true,
            'last_seen_at' => ($data['connected'] ?? true) ? now() : null,
            'notes' => $data['notes'] ?? null,
        ]);

        AuditLog::record("Updated smart device #{$smartDevice->id}", $smartDevice);

        return redirect()->route('smart-devices.index');
    }

    public function destroy(SmartDevice $smartDevice): RedirectResponse
    {
        AuditLog::record("Deleted smart device #{$smartDevice->id}");

        $smartDevice->delete();

        return redirect()->route('smart-devices.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function validateDevice(Request $request): array
    {
        return $request->validate([
            'device_name' => ['required', 'string', 'max:255'],
            'device_type' => ['required', Rule::in(self::DEVICE_TYPES)],
            'location' => ['nullable', 'string', 'max:255'],
            'vendor' => ['nullable', 'string', 'max:255'],
            'model' => ['nullable', 'string', 'max:255'],
            'serial_number' => ['nullable', 'string', 'max:255'],
            'ip_address' => ['nullable', 'ip'],
            'status' => ['required', Rule::in(self::STATUSES)],
            'connected' => ['sometimes', 'boolean'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);
    }
}
