<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Staff;
use App\Models\StaffClockLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class StaffController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('staff/index', [
            'staff' => Staff::withCount('clockLogs')->latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('staff/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateStaff($request);

        Staff::create([
            'society_id' => active_society_id(),
            'name' => $data['name'],
            'phone' => $data['phone'] ?? null,
            'email' => $data['email'] ?? null,
            'designation' => $data['designation'],
            'shift' => $data['shift'],
            'photo' => $data['photo'] ?? null,
            'date_joined' => $data['date_joined'] ?? null,
            'is_active' => $data['is_active'] ?? true,
        ]);

        AuditLog::record("Added staff member: {$data['name']}");

        return redirect()->route('staff.index');
    }

    public function edit(Staff $staff): Response
    {
        return Inertia::render('staff/edit', [
            'staff' => $staff,
        ]);
    }

    public function update(Request $request, Staff $staff): RedirectResponse
    {
        $data = $this->validateStaff($request);

        $staff->update([
            'name' => $data['name'],
            'phone' => $data['phone'] ?? null,
            'email' => $data['email'] ?? null,
            'designation' => $data['designation'],
            'shift' => $data['shift'],
            'photo' => $data['photo'] ?? null,
            'date_joined' => $data['date_joined'] ?? null,
            'is_active' => $data['is_active'] ?? true,
        ]);

        AuditLog::record("Updated staff member: {$data['name']}", $staff);

        return redirect()->route('staff.index');
    }

    public function destroy(Staff $staff): RedirectResponse
    {
        AuditLog::record("Removed staff member: {$staff->name}", $staff);

        $staff->delete();

        return redirect()->route('staff.index');
    }

    public function attendance(Staff $staff): Response
    {
        return Inertia::render('staff/attendance', [
            'staff' => $staff,
            'logs' => $staff->clockLogs()->with('recordedBy')->latest('date')->latest('check_in_time')->get(),
        ]);
    }

    public function clockIn(Request $request, Staff $staff): RedirectResponse
    {
        $data = $request->validate([
            'date' => ['required', 'date'],
            'check_in_time' => ['nullable', 'date'],
        ]);

        StaffClockLog::create([
            'society_id' => active_society_id(),
            'staff_id' => $staff->id,
            'recorded_by' => auth()->id() ? (int) auth()->id() : null,
            'date' => $data['date'],
            'check_in_time' => $data['check_in_time'] ?? now(),
            'status' => 'checked_in',
        ]);

        AuditLog::record("Clocked in staff: {$staff->name}");

        return redirect()->route('staff.attendance', $staff);
    }

    public function clockOut(Staff $staff, StaffClockLog $log): RedirectResponse
    {
        if ($log->status === 'checked_in') {
            $checkOut = now();
            $duration = $log->check_in_time ? (int) $log->check_in_time->diffInMinutes($checkOut) : null;

            $log->update([
                'check_out_time' => $checkOut,
                'duration_minutes' => $duration,
                'status' => 'checked_out',
            ]);

            AuditLog::record("Clocked out staff: {$staff->name}");
        }

        return redirect()->route('staff.attendance', $staff);
    }

    public function destroyLog(Staff $staff, StaffClockLog $log): RedirectResponse
    {
        $log->delete();

        AuditLog::record("Deleted clock log for staff: {$staff->name}");

        return redirect()->route('staff.attendance', $staff);
    }

    /**
     * @return array<string, mixed>
     */
    protected function validateStaff(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'designation' => ['required', 'string', 'max:255'],
            'shift' => ['required', Rule::in(['morning', 'evening', 'night', 'general'])],
            'photo' => ['nullable', 'string', 'max:255'],
            'date_joined' => ['nullable', 'date'],
            'is_active' => ['nullable', 'boolean'],
        ]);
    }
}
