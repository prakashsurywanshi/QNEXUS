<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('society_payments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('society_id')->nullable();
            $table->foreign('society_id')->references('id')->on('societies')->onDelete('cascade')->onUpdate('cascade');
            $table->decimal('amount', 10, 2);
            $table->enum('status', ['pending', 'paid', 'failed'])->default('pending');
            $table->enum('payment_source', ['official_site', 'app_sumo'])->default('official_site');
            $table->string('razorpay_order_id')->nullable();
            $table->string('razorpay_payment_id')->nullable();
            $table->string('razorpay_signature')->nullable();
            $table->string('transaction_id')->nullable();
            $table->string('payment_date_time')->nullable();
            $table->string('stripe_payment_intent')->nullable();
            $table->text('stripe_session_id')->nullable();
            $table->foreignId('package_id')->nullable()->constrained('packages')->onDelete('cascade');
            $table->string('package_type')->nullable();
            $table->string('currency_id')->nullable();
            $table->string('flutterwave_transaction_id')->nullable();
            $table->string('flutterwave_payment_ref')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('society_payments');
    }
};