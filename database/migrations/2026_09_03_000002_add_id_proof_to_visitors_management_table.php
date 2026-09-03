<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE visitors_management ADD COLUMN id_proof_type VARCHAR(255) NULL AFTER visitor_type_id, ADD COLUMN id_proof_number VARCHAR(255) NULL AFTER id_proof_type");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE visitors_management DROP COLUMN id_proof_type, DROP COLUMN id_proof_number");
    }
};
