<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('move_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('society_id')->nullable()->constrained('societies')->cascadeOnDelete();
            $table->foreignId('apartment_id')->nullable()->constrained('apartment_managements');
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('move_type', ['in', 'out']);
            $table->date('move_date');
            $table->text('forwarding_address')->nullable();
            $table->decimal('deposit_amount', 12, 2)->default(0);
            $table->enum('deposit_status', ['pending', 'refunded', 'forfeited'])->default('pending');
            $table->decimal('pending_dues', 12, 2)->default(0);
            $table->enum('noc_status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->foreignId('noc_issued_by')->nullable()->constrained('users');
            $table->date('noc_date')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('move_records');
    }
};