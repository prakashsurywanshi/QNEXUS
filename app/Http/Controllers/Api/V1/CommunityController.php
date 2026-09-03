<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\RoleAwareApiController;
use App\Models\Event;
use App\Models\EventRsvp;
use App\Models\Meeting;
use App\Models\MeetingAttendee;
use App\Models\Poll;
use App\Models\PollOption;
use App\Models\PollVote;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class CommunityController extends RoleAwareApiController
{
    public function events(Request $request): JsonResponse
    {
        $society = $this->requireSociety();

        $query = Event::with('rsvps')->where('society_id', $society->id);

        if ($this->roleIs(['Owner', 'Tenant'])) {
            $query->active();
        }

        $items = $query->orderByDesc('start_date')
            ->paginate((int) $request->get('per_page', 15));

        return $this->paginated($items);
    }

    public function rsvp(Request $request, $id): JsonResponse
    {
        $society = $this->requireSociety();
        $userId = $this->authUser()->id;

        $event = Event::where('society_id', $society->id)->find($id);

        if (! $event) {
            return $this->notFound('Event not found.');
        }

        $validated = $request->validate([
            'status' => ['required', Rule::in(['going', 'not_going', 'maybe'])],
        ]);

        $rsvp = EventRsvp::updateOrCreate(
            ['event_id' => $event->id, 'user_id' => $userId],
            ['status' => $validated['status'], 'responded_at' => now()]
        );

        return $this->success($rsvp, 'RSVP updated');
    }

    public function polls(Request $request): JsonResponse
    {
        $society = $this->requireSociety();
        $userId = $this->authUser()->id;

        $polls = Poll::with('options')
            ->where('society_id', $society->id)
            ->where('status', 'active')
            ->orderByDesc('end_date')
            ->get()
            ->map(function (Poll $poll) use ($userId) {
                $myVote = PollVote::where('poll_id', $poll->id)->where('user_id', $userId)->first();
                $showResults = $poll->results_visible;

                return [
                    'id' => $poll->id,
                    'title' => $poll->title,
                    'description' => $poll->description,
                    'poll_type' => $poll->poll_type,
                    'start_date' => $poll->start_date,
                    'end_date' => $poll->end_date,
                    'status' => $poll->status,
                    'my_vote_option_id' => $myVote?->option_id,
                    'options' => $poll->options->map(function (PollOption $option) use ($showResults) {
                        return [
                            'id' => $option->id,
                            'label' => $option->option_text,
                            'votes' => $showResults ? $option->votes()->count() : null,
                        ];
                    }),
                ];
            });

        return $this->success($polls, 'Polls fetched');
    }

    public function vote(Request $request, $id): JsonResponse
    {
        $society = $this->requireSociety();
        $userId = $this->authUser()->id;

        $poll = Poll::where('society_id', $society->id)->find($id);

        if (! $poll) {
            return $this->notFound('Poll not found.');
        }

        if (! $poll->isActive()) {
            return $this->error('Poll is not active.', 422);
        }

        if (PollVote::where('poll_id', $poll->id)->where('user_id', $userId)->exists()) {
            return $this->error('You have already voted on this poll.', 422);
        }

        $validated = $request->validate([
            'option_id' => ['required', 'integer', Rule::exists('poll_options', 'id')->where('poll_id', $poll->id)],
        ]);

        $vote = PollVote::create([
            'poll_id' => $poll->id,
            'option_id' => $validated['option_id'],
            'user_id' => $userId,
            'vote_hash' => $poll->isSecret() ? Str::uuid()->toString() : null,
            'voted_at' => now(),
        ]);

        return $this->created($vote, 'Vote recorded');
    }

    public function meetings(Request $request): JsonResponse
    {
        $society = $this->requireSociety();

        $query = Meeting::with('organizer')->where('society_id', $society->id);

        if ($this->roleIs(['Owner', 'Tenant'])) {
            $query->upcoming();
        }

        $items = $query->orderByDesc('meeting_date')
            ->paginate((int) $request->get('per_page', 15));

        return $this->paginated($items);
    }

    public function attend(Request $request, $id): JsonResponse
    {
        $society = $this->requireSociety();
        $userId = $this->authUser()->id;

        $meeting = Meeting::where('society_id', $society->id)->find($id);

        if (! $meeting) {
            return $this->notFound('Meeting not found.');
        }

        $validated = $request->validate([
            'attendance_status' => ['nullable', Rule::in(['present', 'absent', 'apology'])],
        ]);

        $attendee = MeetingAttendee::updateOrCreate(
            ['meeting_id' => $meeting->id, 'user_id' => $userId],
            ['attendance_status' => $validated['attendance_status'] ?? 'present']
        );

        return $this->success($attendee, 'Attendance recorded');
    }
}
