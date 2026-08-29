<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('flutterwave_payments', function (Blueprint $table) {
            $table->id();
            $table->string('flutterwave_payment_id')->nullable();
            $table->unsignedBigInteger('maintenance_apartment_id');
            $table->foreign('maintenance_apartment_id')->references('id')->on('maintenance_apartment')->onDelete('cascade');
            $table->decimal('amount', 10, 2);
            $table->enum('payment_status', ['pending', 'completed', 'failed'])->default('pending');
            $table->timestamp('payment_date')->nullable();
            $table->json('payment_error_response')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('flutterwave_payments');
    }
};