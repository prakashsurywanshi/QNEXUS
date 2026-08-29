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
});

function provisionedSociety(): Society
{
    $society = Society::create(['name' => 'API Demo']);
    (new RoleSeeder())->run($society);

    return $society;
}

function makeApiUser(Society $society, string $roleDisplayName): User
{
    $role = Role::where('society_id', $society->id)
        ->where('display_name', $roleDisplayName)
        ->first();

    $user = User::create([
        'name' => "{$roleDisplayName} User",
        'email' => strtolower($roleDisplayName) . '@qnexus.test',
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

it('issues a bearer token on login and returns the role', function () {
    $society = provisionedSociety();
    makeApiUser($society, 'Admin');

    $response = $this->postJson('/api/v1/login', [
        'email' => 'admin@qnexus.test',
        'password' => '123456',
    ]);

    $response->assertOk()
        ->assertJsonPath('success', true)
        ->assertJsonStructure([
            'data' => ['token', 'token_type', 'user' => ['id', 'email', 'role' => ['display_name']]],
        ]);

    expect($response->json('data.user.role.display_name'))->toBe('Admin');
    expect($response->json('data.token_type'))->toBe('Bearer');
});

it('rejects invalid credentials', function () {
    $society = provisionedSociety();
    makeApiUser($society, 'Admin');

    $this->postJson('/api/v1/login', [
        'email' => 'admin@qnexus.test',
        'password' => 'wrong-password',
    ])->assertStatus(422);
});

it('returns the authenticated profile with its permissions', function () {
    $society = provisionedSociety();
    makeApiUser($society, 'Guard');

    $token = User::where('email', 'guard@qnexus.test')->first()->createToken('auth-token')->plainTextToken;

    $response = $this->withToken($token)
        ->getJson('/api/v1/profile');

    $response->assertOk()
        ->assertJsonPath('data.role.display_name', 'Guard')
        ->assertJsonCount(5, 'data.permissions');
});

it('provisions exactly five roles per society', function () {
    $society = provisionedSociety();

    expect(Role::where('society_id', $society->id)->count())->toBe(5);

    $byName = Role::where('society_id', $society->id)->pluck('display_name')->all();
    expect($byName)->toEqualCanonicalizing(['Admin', 'Manager', 'Owner', 'Tenant', 'Guard']);
});

it('grants every permission to admin and manager roles', function () {
    $society = provisionedSociety();

    $total = \App\Models\Permission::count();

    foreach (['Admin', 'Manager'] as $roleName) {
        $role = Role::where('society_id', $society->id)->where('display_name', $roleName)->first();
        expect($role->permissions()->count())->toBe($total);
    }
});
