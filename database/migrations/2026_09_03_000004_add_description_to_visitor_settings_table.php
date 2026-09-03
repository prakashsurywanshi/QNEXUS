<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE visitor_settings ADD COLUMN description VARCHAR(500) NULL AFTER name");
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE visitor_settings DROP COLUMN description');
    }
};
