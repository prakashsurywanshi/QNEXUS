<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('boom_barrier_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('society_id')->nullable()->constrained('societies')->cascadeOnDelete();
            $table->string('gate_name')->nullable();
            $table->string('vehicle_number')->nullable();
            $table->enum('direction', ['in', 'out']);
            $table->enum('barrier_type', ['vehicle', 'pedestrian']);
            $table->enum('trigger_method', ['manual', 'remote', 'auto_number_plate', 'qr_code', 'rfid'])->default('manual');
            $table->string('qr_code', 64)->nullable()->index();
            $table->foreignId('triggered_by')->nullable()->constrained('users')->nullOnDelete();
            $table->boolean('is_visitor')->default(false);
            $table->foreignId('visitor_preapproval_id')->nullable()->constrained('visitor_preapprovals')->nullOnDelete();
            $table->timestamp('opened_at');
            $table->timestamp('closed_at')->nullable();
            $table->string('camera_snapshot')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('boom_barrier_logs');
    }
};