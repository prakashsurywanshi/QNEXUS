<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE visitors_management MODIFY COLUMN status ENUM('pending', 'allowed', 'not_allowed', 'checked_in', 'checked_out') DEFAULT 'pending'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE visitors_management MODIFY COLUMN status ENUM('pending', 'allowed', 'not_allowed') DEFAULT 'pending'");
    }
};
