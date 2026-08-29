<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lease_agreements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('society_id')->nullable()->constrained('societies')->cascadeOnDelete();
            $table->foreignId('commercial_tenant_id')->constrained('commercial_tenants')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->string('lease_number');
            $table->date('start_date');
            $table->date('end_date');
            $table->decimal('monthly_rent', 12, 2)->default(0);
            $table->decimal('security_deposit', 12, 2)->default(0);
            $table->decimal('cam_charges', 12, 2)->default(0);
            $table->enum('rent_escalation_type', ['fixed', 'percentage'])->default('fixed');
            $table->decimal('escalation_value', 5, 2)->default(0);
            $table->integer('escalation_frequency_months')->default(12);
            $table->enum('status', ['draft', 'active', 'expired', 'terminated'])->default('draft');
            $table->string('document_path')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lease_agreements');
    }
};