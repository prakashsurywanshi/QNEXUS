<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('utility_bills', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('society_id')->nullable();
            $table->foreign('society_id')->references('id')->on('societies')->onDelete('cascade')->onUpdate('cascade');
            $table->foreignId('apartment_id')->constrained('apartment_managements')->onDelete('cascade')->onUpdate('cascade');
            $table->foreignId('bill_type_id')->nullable()->constrained('bill_types')->onDelete('set null')->onUpdate('cascade');
            $table->date('bill_date')->nullable();
            $table->enum('status', ['unpaid', 'paid'])->default('unpaid');
            $table->string('payment_proof')->nullable();
            $table->string('bill_proof')->nullable();
            $table->date('bill_payment_date')->nullable();
            $table->date('bill_due_date')->nullable();
            $table->double('bill_amount', 16, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('utility_bills');
    }
};