<?php

use App\Models\Role;
use App\Models\Society;
use App\Models\SocietyUser;
use App\Models\User;
use Database\Seeders\ModuleSeeder;
use Database\Seeders\PermissionSeeder;
use Database\Seeders\RoleSeeder;

beforeEach(function () {
    $this->seed(ModuleSeeder::class);
    $this->seed(PermissionSeeder::class);

    $this->society = Society::create(['name' => 'Role API Demo']);
    (new RoleSeeder())->run($this->society);
});

function roleApiUser(Society $society, string $displayName, string $email): User
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

function apiTokenFor(User $user): string
{
    return $user->createToken('auth-token')->plainTextToken;
}

it('provides a dashboard for every one of the five roles', function (string $role, string $email) {
    $user = roleApiUser($this->society, $role, $email);

    $this->withToken(apiTokenFor($user))
        ->getJson('/api/v1/dashboard')
        ->assertOk()
        ->assertJsonPath('data.role', $role)
        ->assertJsonStructure(['data' => ['society', 'role', 'user', 'counts']]);
})->with([
    ['Admin', 'admin@role.test'],
    ['Manager', 'manager@role.test'],
    ['Owner', 'owner@role.test'],
    ['Tenant', 'tenant@role.test'],
    ['Guard', 'guard@role.test'],
]);

it('lets residents book an amenity', function () {
    $user = roleApiUser($this->society, 'Tenant', 'tenant@role.test');
    $amenity = \App\Models\Amenities::create([
        'society_id' => $this->society->id,
        'amenities_name' => 'Club House',
        'status' => 'available',
    ]);

    $this->withToken(apiTokenFor($user))
        ->postJson('/api/v1/amenity-bookings', [
            'amenity_id' => $amenity->id,
            'booking_date' => now()->addDay()->toDateString(),
            'booking_time' => '18:00',
            'persons' => 4,
        ])
        ->assertStatus(201)
        ->assertJsonPath('success', true);
});

it('prevents a guard from booking amenities (403)', function () {
    $user = roleApiUser($this->society, 'Guard', 'guard@role.test');

    $this->withToken(apiTokenFor($user))
        ->postJson('/api/v1/amenity-bookings', [
            'amenity_id' => 1,
            'booking_date' => now()->addDay()->toDateString(),
            'booking_time' => '18:00',
            'persons' => 2,
        ])
        ->assertStatus(403);
});

it('lets residents create tickets', function () {
    $user = roleApiUser($this->society, 'Owner', 'owner@role.test');

    $response = $this->withToken(apiTokenFor($user))
        ->postJson('/api/v1/tickets', ['subject' => 'Water leak'])
        ->assertStatus(201);

    expect($response->json('data.status'))->toBe('open');
});

it('lets guards check in a visitor', function () {
    $user = roleApiUser($this->society, 'Guard', 'guard@role.test');

    $this->withToken(apiTokenFor($user))
        ->postJson('/api/v1/visitors/checkin', ['visitor_name' => 'John Doe'])
        ->assertStatus(201)
        ->assertJsonPath('data.status', 'allowed');
});

it('prevents a tenant from checking in visitors (403)', function () {
    $user = roleApiUser($this->society, 'Tenant', 'tenant@role.test');

    $this->withToken(apiTokenFor($user))
        ->postJson('/api/v1/visitors/checkin', ['visitor_name' => 'John Doe'])
        ->assertStatus(403);
});

it('lets managers publish notices', function () {
    $user = roleApiUser($this->society, 'Manager', 'manager@role.test');

    $this->withToken(apiTokenFor($user))
        ->postJson('/api/v1/notices', ['title' => 'Maintenance shutdown'])
        ->assertStatus(201);
});

it('rejects unauthenticated access to role-aware endpoints', function () {
    $this->getJson('/api/v1/dashboard')->assertStatus(401);
});

it('lets everyone read notices', function (string $role, string $email) {
    \App\Models\Notice::create([
        'society_id' => $this->society->id,
        'title' => 'Notice 1',
    ]);

    $user = roleApiUser($this->society, $role, $email);

    $this->withToken(apiTokenFor($user))
        ->getJson('/api/v1/notices')
        ->assertOk();
})->with([
    ['Admin', 'adm2@role.test'],
    ['Manager', 'mgr2@role.test'],
    ['Owner', 'own2@role.test'],
    ['Tenant', 'ten2@role.test'],
    ['Guard', 'gua2@role.test'],
]);
