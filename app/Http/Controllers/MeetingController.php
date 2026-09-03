<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Meeting;
use App\Models\MeetingAttendee;
use App\Models\MeetingMinute;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class MeetingController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('meetings/index', [
            'meetings' => Meeting::with(['organizer', 'minutes', 'attendees'])->latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('meetings/create', [
            'users' => User::where('society_id', active_society_id())->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateMeeting($request);

        DB::transaction(function () use ($data) {
            $meeting = Meeting::create([
                'society_id' => active_society_id(),
                'title' => $data['title'],
                'description' => $data['description'] ?? null,
                'meeting_date' => $data['meeting_date'],
                'meeting_time' => $data['meeting_time'],
                'location' => $data['location'],
                'organized_by' => auth()->id() ? (int) auth()->id() : 0,
                'status' => $data['status'],
            ]);

            foreach ($data['minutes'] ?? [] as $minute) {
                if (empty($minute['agenda_item'])) {
                    continue;
                }
                MeetingMinute::create([
                    'meeting_id' => $meeting->id,
                    'agenda_item' => $minute['agenda_item'],
                    'discussion' => $minute['discussion'] ?? null,
                    'decision' => $minute['decision'] ?? null,
                    'assigned_to' => $minute['assigned_to'] ?? null,
                    'due_date' => $minute['due_date'] ?? null,
                    'status' => $minute['status'] ?? 'open',
                ]);
            }

            foreach ($data['attendees'] ?? [] as $attendee) {
                if (empty($attendee['user_id'])) {
                    continue;
                }
                MeetingAttendee::firstOrCreate([
                    'meeting_id' => $meeting->id,
                    'user_id' => $attendee['user_id'],
                ], [
                    'attendance_status' => $attendee['attendance_status'] ?? 'present',
                ]);
            }
        });

        AuditLog::record("Created meeting: {$data['title']}");

        return redirect()->route('meetings.index');
    }

    public function edit(Meeting $meeting): Response
    {
        return Inertia::render('meetings/edit', [
            'meeting' => $meeting->load(['organizer', 'minutes', 'attendees']),
            'users' => User::where('society_id', active_society_id())->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, Meeting $meeting): RedirectResponse
    {
        $data = $this->validateMeeting($request);

        DB::transaction(function () use ($data, $meeting) {
            $meeting->update([
                'title' => $data['title'],
                'description' => $data['description'] ?? null,
                'meeting_date' => $data['meeting_date'],
                'meeting_time' => $data['meeting_time'],
                'location' => $data['location'],
                'status' => $data['status'],
            ]);

            $meeting->minutes()->delete();
            foreach ($data['minutes'] ?? [] as $minute) {
                if (empty($minute['agenda_item'])) {
                    continue;
                }
                MeetingMinute::create([
                    'meeting_id' => $meeting->id,
                    'agenda_item' => $minute['agenda_item'],
                    'discussion' => $minute['discussion'] ?? null,
                    'decision' => $minute['decision'] ?? null,
                    'assigned_to' => $minute['assigned_to'] ?? null,
                    'due_date' => $minute['due_date'] ?? null,
                    'status' => $minute['status'] ?? 'open',
                ]);
            }

            $meeting->attendees()->delete();
            foreach ($data['attendees'] ?? [] as $attendee) {
                if (empty($attendee['user_id'])) {
                    continue;
                }
                MeetingAttendee::create([
                    'meeting_id' => $meeting->id,
                    'user_id' => $attendee['user_id'],
                    'attendance_status' => $attendee['attendance_status'] ?? 'present',
                ]);
            }
        });

        AuditLog::record("Updated meeting: {$data['title']}", $meeting);

        return redirect()->route('meetings.index');
    }

    public function destroy(Meeting $meeting): RedirectResponse
    {
        AuditLog::record("Deleted meeting: {$meeting->title}");
        $meeting->minutes()->delete();
        $meeting->attendees()->delete();
        $meeting->delete();

        return redirect()->route('meetings.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function validateMeeting(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'meeting_date' => ['required', 'date'],
            'meeting_time' => ['required'],
            'location' => ['required', 'string', 'max:255'],
            'status' => ['required', Rule::in(['scheduled', 'in_progress', 'completed', 'cancelled'])],
            'minutes' => ['array'],
            'minutes.*.agenda_item' => ['nullable', 'string'],
            'minutes.*.discussion' => ['nullable', 'string'],
            'minutes.*.decision' => ['nullable', 'string'],
            'minutes.*.assigned_to' => ['nullable', 'exists:users,id'],
            'minutes.*.due_date' => ['nullable', 'date'],
            'minutes.*.status' => ['nullable', Rule::in(['open', 'in_progress', 'completed'])],
            'attendees' => ['array'],
            'attendees.*.user_id' => ['nullable', 'exists:users,id'],
            'attendees.*.attendance_status' => ['nullable', Rule::in(['present', 'absent', 'apology'])],
        ]);
    }
}
