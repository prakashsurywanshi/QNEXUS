<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->unsignedBigInteger('society_id')->nullable()->after('id');
        });

        DB::statement('UPDATE payments
            JOIN maintenance_apartment ON maintenance_apartment.id = payments.maintenance_apartment_id
            JOIN maintenance_management ON maintenance_management.id = maintenance_apartment.maintenance_management_id
            SET payments.society_id = maintenance_management.society_id');

        Schema::table('payments', function (Blueprint $table) {
            $table->foreign('society_id')->references('id')->on('societies')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropForeign(['society_id']);
            $table->dropColumn('society_id');
        });
    }
};