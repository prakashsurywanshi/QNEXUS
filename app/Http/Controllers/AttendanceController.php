<?php

namespace App\Http\Controllers;

use App\Models\WorkerCheckinLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('attendance/index', [
            'records' => WorkerCheckinLog::latest()->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'worker_name' => ['required', 'string', 'max:255'],
            'worker_phone' => ['nullable', 'string', 'max:20'],
            'worker_type' => ['nullable', 'string', 'max:255'],
            'apartment_id' => ['nullable', 'integer', 'exists:apartment_managements,id'],
            'notes' => ['nullable', 'string'],
        ]);

        WorkerCheckinLog::create($data + [
            'society_id' => active_society_id(),
            'user_id' => auth()->id(),
            'status' => 'checked_in',
            'check_in_time' => now(),
        ]);

        return redirect()->route('attendance.index');
    }

    public function update(Request $request, WorkerCheckinLog $record): RedirectResponse
    {
        $checkOutTime = now();

        $record->update([
            'check_out_time' => $checkOutTime,
            'status' => 'checked_out',
        ]);

        return redirect()->route('attendance.index');
    }

    public function destroy(WorkerCheckinLog $record): RedirectResponse
    {
        $record->delete();

        return redirect()->route('attendance.index');
    }
}
