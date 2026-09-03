<?php

use App\Models\Apartment;
use App\Models\ApartmentManagement;
use App\Models\DailyHelpBooking;
use App\Models\DailyHelpWorker;
use App\Models\Event;
use App\Models\EventRsvp;
use App\Models\Floor;
use App\Models\Gatepass;
use App\Models\MaintenanceApartment;
use App\Models\MaintenanceManagement;
use App\Models\Meeting;
use App\Models\MeetingAttendee;
use App\Models\Payment;
use App\Models\Poll;
use App\Models\PollOption;
use App\Models\PollVote;
use App\Models\Role;
use App\Models\ServiceRequest;
use App\Models\ServiceRequestReply;
use App\Models\Society;
use App\Models\SocietyUser;
use App\Models\Tower;
use App\Models\User;
use Database\Seeders\ModuleSeeder;
use Database\Seeders\PermissionSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Database\Eloquent\Model;

beforeEach(function () {
    $this->seed(ModuleSeeder::class);
    $this->seed(PermissionSeeder::class);

    $this->society = Society::create(['name' => 'Mobile Expansion Demo']);
    (new RoleSeeder)->run($this->society);
});

function mobileUser(Society $society, string $displayName, string $email): User
{
    $role = Role::where('society_id', $society->id)
        ->where('display_name', $displayName)
        ->first();

    $user = User::create([
        'name' => "$displayName User",
        'email' => $email,
        'password' => '123456',
        'society_id' => $society->id,
        'role_id' => $role->id,
    ]);

    SocietyUser::create([
        'user_id' => $user->id,
        'society_id' => $society->id,
        'role_id' => $role->id,
    ]);

    return $user;
}

function mobileToken(User $user): string
{
    return $user->createToken('auth-token')->plainTextToken;
}

function mobileApartment(Society $society, int $userId, string $number): ApartmentManagement
{
    $tower = Model::unguarded(fn () => Tower::create([
        'society_id' => $society->id,
        'tower_name' => "Tower $number",
    ]));

    $floor = Model::unguarded(fn () => Floor::create([
        'society_id' => $society->id,
        'floor_name' => "Floor $number",
        'tower_id' => $tower->id,
    ]));

    $apartment = Model::unguarded(fn () => Apartment::create([
        'society_id' => $society->id,
        'apartment_type' => '2BHK',
    ]));

    return Model::unguarded(fn () => ApartmentManagement::create([
        'society_id' => $society->id,
        'user_id' => $userId,
        'apartment_number' => $number,
        'apartment_area' => 1000,
        'apartment_area_unit' => 'sqft',
        'floor_id' => $floor->id,
        'tower_id' => $tower->id,
        'apartment_id' => $apartment->id,
        'status' => 'occupied',
    ]));
}

it('lets a resident list, create, and reply to service requests', function () {
    $user = mobileUser($this->society, 'Owner', 'owner@svc.test');

    $created = $this->withToken(mobileToken($user))
        ->postJson('/api/v1/service-requests', [
            'subject' => 'Fix leaking tap',
            'service_type' => 'Plumbing',
            'priority' => 'high',
            'description' => 'Kitchen tap leaks',
        ])
        ->assertStatus(201)
        ->json('data');

    expect($created['status'])->toBe('request');

    $this->withToken(mobileToken($user))
        ->postJson("/api/v1/service-requests/{$created['id']}/reply", ['message' => 'Please prioritize'])
        ->assertStatus(201);

    expect(ServiceRequestReply::where('service_request_id', $created['id'])->count())->toBe(1);

    $this->withToken(mobileToken($user))
        ->getJson('/api/v1/service-requests')
        ->assertOk()
        ->assertJsonCount(1, 'data');
});

it('restricts a resident from seeing another residents service request', function () {
    $owner = mobileUser($this->society, 'Owner', 'owner1@svc.test');
    $tenant = mobileUser($this->society, 'Tenant', 'tenant1@svc.test');

    $sr = ServiceRequest::create([
        'society_id' => $this->society->id,
        'user_id' => $owner->id,
        'subject' => 'Owner request',
        'service_type' => 'Electrical',
        'priority' => 'medium',
        'status' => 'request',
    ]);

    $this->withToken(mobileToken($tenant))
        ->getJson("/api/v1/service-requests/{$sr->id}")
        ->assertStatus(403);
});

it('lets managers quote and advance a service request', function () {
    $owner = mobileUser($this->society, 'Owner', 'owner2@svc.test');
    $req = ServiceRequest::create([
        'society_id' => $this->society->id,
        'user_id' => $owner->id,
        'subject' => 'AC repair',
        'service_type' => 'General Maintenance',
        'priority' => 'low',
        'status' => 'request',
    ]);

    $manager = mobileUser($this->society, 'Manager', 'manager@svc.test');

    $this->withToken(mobileToken($manager))
        ->postJson("/api/v1/service-requests/{$req->id}/quote", ['quote_amount' => 1500])
        ->assertStatus(200)
        ->assertJsonPath('data.status', 'quoted');

    $this->withToken(mobileToken($manager))
        ->patchJson("/api/v1/service-requests/{$req->id}/advance", ['status' => 'approved'])
        ->assertStatus(200)
        ->assertJsonPath('data.status', 'approved');
});

it('lets residents create visitor pre-approvals and see them', function () {
    $user = mobileUser($this->society, 'Owner', 'owner@va.test');

    $created = $this->withToken(mobileToken($user))
        ->postJson('/api/v1/visitor-preapprovals', [
            'visitor_name' => 'Alice',
            'visitor_phone' => '9000000000',
            'expected_arrival' => now()->addDay()->toDateTimeString(),
            'purpose' => 'Family',
        ])
        ->assertStatus(201)
        ->json('data');

    expect($created['status'])->toBe('pending');

    $this->withToken(mobileToken($user))
        ->getJson('/api/v1/visitor-preapprovals')
        ->assertOk()
        ->assertJsonCount(1, 'data');
});

it('lets residents list gatepasses', function () {
    $user = mobileUser($this->society, 'Owner', 'owner@gate.test');
    Gatepass::create([
        'society_id' => $this->society->id,
        'user_id' => $user->id,
        'item_description' => 'Groceries',
        'gatepass_type' => 'in',
        'status' => 'pending',
    ]);

    $this->withToken(mobileToken($user))
        ->getJson('/api/v1/gatepasses')
        ->assertOk()
        ->assertJsonCount(1, 'data');
});

it('lets residents view events and rsvp', function () {
    $user = mobileUser($this->society, 'Owner', 'owner@event.test');
    $event = Event::create([
        'society_id' => $this->society->id,
        'title' => 'Diwali night',
        'description' => 'Community celebration',
        'status' => 'published',
        'start_date' => now()->addDays(3)->toDateString(),
        'end_date' => now()->addDays(3)->toDateString(),
        'start_time' => '18:00:00',
        'end_time' => '21:00:00',
        'location' => 'Club House',
        'created_by' => $user->id,
    ]);

    $this->withToken(mobileToken($user))
        ->postJson("/api/v1/events/{$event->id}/rsvp", ['status' => 'going'])
        ->assertStatus(200);

    expect(EventRsvp::where('event_id', $event->id)->where('user_id', $user->id)->count())->toBe(1);
});

it('lets residents vote once on an active poll', function () {
    $user = mobileUser($this->society, 'Owner', 'owner@poll.test');
    $poll = Poll::create([
        'society_id' => $this->society->id,
        'title' => 'Which party?',
        'poll_type' => 'normal',
        'start_date' => now()->subDay()->toDateString(),
        'end_date' => now()->addDays(3)->toDateString(),
        'status' => 'active',
        'created_by' => $user->id,
    ]);
    $optionA = PollOption::create(['poll_id' => $poll->id, 'option_text' => 'Kids party', 'sort_order' => 1]);
    $optionB = PollOption::create(['poll_id' => $poll->id, 'option_text' => 'Adults party', 'sort_order' => 2]);

    $this->withToken(mobileToken($user))
        ->postJson("/api/v1/polls/{$poll->id}/vote", ['option_id' => $optionA->id])
        ->assertStatus(201);

    expect(PollVote::where('poll_id', $poll->id)->where('user_id', $user->id)->count())->toBe(1);

    $this->withToken(mobileToken($user))
        ->postJson("/api/v1/polls/{$poll->id}/vote", ['option_id' => $optionB->id])
        ->assertStatus(422);
});

it('does not allow voting on an option from a different poll', function () {
    $user = mobileUser($this->society, 'Owner', 'owner@poll2.test');
    $poll = Poll::create([
        'society_id' => $this->society->id,
        'title' => 'Poll A',
        'poll_type' => 'normal',
        'start_date' => now()->subDay()->toDateString(),
        'end_date' => now()->addDays(3)->toDateString(),
        'status' => 'active',
        'created_by' => $user->id,
    ]);
    $pollB = Poll::create([
        'society_id' => $this->society->id,
        'title' => 'Poll B',
        'poll_type' => 'normal',
        'start_date' => now()->subDay()->toDateString(),
        'end_date' => now()->addDays(3)->toDateString(),
        'status' => 'active',
        'created_by' => $user->id,
    ]);
    $optionOfB = PollOption::create(['poll_id' => $pollB->id, 'option_text' => 'B1', 'sort_order' => 1]);

    $this->withToken(mobileToken($user))
        ->postJson("/api/v1/polls/{$poll->id}/vote", ['option_id' => $optionOfB->id])
        ->assertStatus(422);
});

it('lets residents mark attendance for a meeting', function () {
    $user = mobileUser($this->society, 'Owner', 'owner@meet.test');
    $meeting = Meeting::create([
        'society_id' => $this->society->id,
        'title' => 'AGM',
        'meeting_date' => now()->addWeek()->toDateString(),
        'meeting_time' => '17:00:00',
        'location' => 'Hall',
        'status' => 'scheduled',
        'organized_by' => $user->id,
    ]);

    $this->withToken(mobileToken($user))
        ->postJson("/api/v1/meetings/{$meeting->id}/attend", ['attendance_status' => 'present'])
        ->assertStatus(200);

    expect(MeetingAttendee::where('meeting_id', $meeting->id)->where('user_id', $user->id)->count())->toBe(1);
});

it('shows a resident their maintenance dues and lets them pay', function () {
    $user = mobileUser($this->society, 'Owner', 'owner@fin.test');
    $apt = mobileApartment($this->society, $user->id, '101');
    $mm = MaintenanceManagement::create([
        'society_id' => $this->society->id,
        'month' => 'September',
        'year' => 2026,
        'status' => 'published',
        'payment_due_date' => now()->addDays(10)->toDateString(),
    ]);
    $due = MaintenanceApartment::create([
        'maintenance_management_id' => $mm->id,
        'apartment_management_id' => $apt->id,
        'cost' => 2000,
        'paid_status' => 'unpaid',
    ]);

    $this->withToken(mobileToken($user))
        ->getJson('/api/v1/maintenance-dues')
        ->assertOk()
        ->assertJsonCount(1, 'data');

    $this->withToken(mobileToken($user))
        ->postJson('/api/v1/payments', [
            'maintenance_apartment_id' => $due->id,
            'amount' => 2000,
            'payment_method' => 'upi',
            'transaction_id' => 'TXN123',
        ])
        ->assertStatus(201);

    expect(Payment::where('maintenance_apartment_id', $due->id)->count())->toBe(1);
    expect($due->refresh()->paid_status)->toBe('paid');
});

it('prevents a resident from paying another residents due', function () {
    $ownerA = mobileUser($this->society, 'Owner', 'ownerA@fin.test');
    $ownerB = mobileUser($this->society, 'Owner', 'ownerB@fin.test');
    $aptA = mobileApartment($this->society, $ownerA->id, '1');
    $aptB = mobileApartment($this->society, $ownerB->id, '2');
    $mm = MaintenanceManagement::create(['society_id' => $this->society->id, 'month' => 'September', 'year' => 2026, 'status' => 'published', 'payment_due_date' => now()->addDays(10)->toDateString()]);
    $dueB = MaintenanceApartment::create(['maintenance_management_id' => $mm->id, 'apartment_management_id' => $aptB->id, 'cost' => 1500, 'paid_status' => 'unpaid']);

    $this->withToken(mobileToken($ownerA))
        ->postJson('/api/v1/payments', [
            'maintenance_apartment_id' => $dueB->id,
            'amount' => 1500,
            'payment_method' => 'cash',
        ])
        ->assertStatus(403);
});

it('lets residents list daily help workers and book them', function () {
    $user = mobileUser($this->society, 'Owner', 'owner@dh.test');
    $worker = DailyHelpWorker::create([
        'society_id' => $this->society->id,
        'name' => 'Ramesh',
        'phone' => '9000000000',
        'service_type' => 'Cleaning',
        'rate_per_visit' => 500,
        'is_active' => true,
        'is_verified' => true,
    ]);

    $this->withToken(mobileToken($user))
        ->getJson('/api/v1/daily-help/workers')
        ->assertOk()
        ->assertJsonCount(1, 'data');

    $this->withToken(mobileToken($user))
        ->postJson('/api/v1/daily-help/bookings', [
            'worker_id' => $worker->id,
            'booking_date' => now()->addDay()->toDateString(),
            'preferred_time' => '10:00',
        ])
        ->assertStatus(201);

    expect(DailyHelpBooking::where('worker_id', $worker->id)->count())->toBe(1);
});
