<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('automations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('society_id');
            $table->foreign('society_id')->references('id')->on('societies')->onDelete('cascade')->onUpdate('cascade');
            $table->string('name');
            $table->enum('trigger_event', ['visitor_qr_expires', 'complaint_sla', 'maintenance_overdue', 'amc_expiring', 'lease_expiring']);
            $table->text('trigger_conditions')->nullable();
            $table->enum('action', ['notify_facility_manager', 'notify_accounts', 'deactivate_access', 'send_reminder', 'escalate_manager']);
            $table->text('action_config')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('automations');
    }
};