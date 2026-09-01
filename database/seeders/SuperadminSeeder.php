<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class SuperadminSeeder extends Seeder
{
    /**
     * Provision the platform-level superadmin account. A superadmin is a user
     * not bound to any society (society_id is null), gated by the
     * EnsureSuperAdmin middleware on the /super-admin/* portal.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'superadmin@qnexus.test'],
            [
                'name' => 'QNEXUS Super Admin',
                'password' => 'password',
                'email_verified_at' => now(),
                'society_id' => null,
                'role_id' => null,
            ]
        );
    }
}
