<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('maintenance_apartment_id');
            $table->foreign('maintenance_apartment_id')->references('id')->on('maintenance_apartment')->onDelete('cascade');

            $table->enum('payment_method', ['cash', 'upi', 'card', 'due', 'stripe', 'razorpay', 'flutterwave'])->default('cash');
            $table->double('amount', 16, 2);
            $table->double('balance', 16, 2)->nullable()->default(0);

            $table->string('transaction_id')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
