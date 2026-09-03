<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('ALTER TABLE visitor_preapprovals MODIFY COLUMN visitor_phone VARCHAR(255) NULL');
        DB::statement('ALTER TABLE visitor_preapprovals MODIFY COLUMN purpose VARCHAR(255) NULL');
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE visitor_preapprovals MODIFY COLUMN visitor_phone VARCHAR(255) NOT NULL');
        DB::statement('ALTER TABLE visitor_preapprovals MODIFY COLUMN purpose VARCHAR(255) NOT NULL');
    }
};
