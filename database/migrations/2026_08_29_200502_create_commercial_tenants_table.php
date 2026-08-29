<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commercial_tenants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('society_id')->nullable()->constrained('societies')->cascadeOnDelete();
            $table->foreignId('building_id')->nullable()->constrained('buildings')->nullOnDelete();
            $table->string('unit_number');
            $table->decimal('unit_area', 10, 2)->default(0);
            $table->decimal('rent_amount', 12, 2)->default(0);
            $table->decimal('security_deposit', 12, 2)->default(0);
            $table->enum('unit_type', ['office', 'retail', 'warehouse', 'other'])->default('office');
            $table->enum('status', ['vacant', 'occupied', 'under_maintenance'])->default('vacant');
            $table->string('company_name')->nullable();
            $table->string('contact_name')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commercial_tenants');
    }
};