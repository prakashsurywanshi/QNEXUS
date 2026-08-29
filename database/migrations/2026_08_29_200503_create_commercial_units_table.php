<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commercial_units', function (Blueprint $table) {
            $table->id();
            $table->foreignId('society_id')->nullable()->constrained('societies')->cascadeOnDelete();
            $table->foreignId('building_id')->nullable()->constrained('buildings')->nullOnDelete();
            $table->foreignId('commercial_tenant_id')->nullable()->constrained('commercial_tenants')->nullOnDelete();
            $table->string('unit_number');
            $table->string('floor')->nullable();
            $table->decimal('area_sqft', 10, 2)->default(0);
            $table->enum('unit_type', ['office', 'retail', 'warehouse', 'other'])->default('office');
            $table->enum('status', ['vacant', 'occupied', 'under_maintenance'])->default('vacant');
            $table->foreignId('tenant_id')->nullable()->constrained('tenants')->nullOnDelete();
            $table->decimal('monthly_rent', 12, 2)->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commercial_units');
    }
};