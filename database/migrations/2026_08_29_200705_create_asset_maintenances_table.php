<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('asset_maintenances', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('society_id')->nullable();
            $table->foreign('society_id')->references('id')->on('societies')->onDelete('cascade')->onUpdate('cascade');
            $table->unsignedBigInteger('asset_id')->nullable();
            $table->foreign('asset_id')->references('id')->on('asset_managements')->onDelete('cascade')->nullable();
            $table->unsignedBigInteger('service_management_id')->nullable();
            $table->foreign('service_management_id')->references('id')->on('service_management')->onDelete('cascade')->nullable();
            $table->date('maintenance_date')->nullable();
            $table->enum('schedule', ['weekly', 'biweekly', 'monthly', 'half-year', 'yearly'])->nullable();
            $table->enum('status', ['pending', 'completed', 'overdue'])->default('pending');
            $table->decimal('amount', 10, 2)->nullable();
            $table->text('notes')->nullable();
            $table->boolean('reminder')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('asset_maintenances');
    }
};