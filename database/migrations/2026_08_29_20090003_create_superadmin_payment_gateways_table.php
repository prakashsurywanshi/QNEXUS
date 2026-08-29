<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('superadmin_payment_gateways', function (Blueprint $table) {
            $table->id();

            $table->enum('razorpay_type', ['test', 'live'])->default('test');

            $table->text('test_razorpay_key')->nullable();
            $table->text('test_razorpay_secret')->nullable();
            $table->text('razorpay_test_webhook_key')->nullable();

            $table->text('live_razorpay_key')->nullable();
            $table->text('live_razorpay_secret')->nullable();
            $table->text('razorpay_live_webhook_key')->nullable();

            $table->boolean('razorpay_status')->default(false);

            $table->enum('stripe_type', ['test', 'live'])->default('test');
            $table->text('test_stripe_key')->nullable();
            $table->text('test_stripe_secret')->nullable();
            $table->text('stripe_test_webhook_key')->nullable();

            $table->text('live_stripe_key')->nullable();
            $table->text('live_stripe_secret')->nullable();
            $table->text('stripe_live_webhook_key')->nullable();

            $table->boolean('stripe_status')->default(false);

            $table->enum('flutterwave_type', ['test', 'live'])->default('test');

            $table->text('test_flutterwave_key')->nullable();
            $table->text('test_flutterwave_secret')->nullable();
            $table->text('test_flutterwave_hash')->nullable();
            $table->text('flutterwave_test_webhook_key')->nullable();

            $table->text('live_flutterwave_key')->nullable();
            $table->text('live_flutterwave_secret')->nullable();
            $table->text('live_flutterwave_hash')->nullable();
            $table->text('flutterwave_live_webhook_key')->nullable();

            $table->boolean('flutterwave_status')->default(false);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('superadmin_payment_gateways');
    }
};