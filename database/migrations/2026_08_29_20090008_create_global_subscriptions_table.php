<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('global_subscriptions')) {
            Schema::create('global_subscriptions', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('society_id')->nullable();
                $table->foreign('society_id')->references('id')->on('societies')->onDelete('cascade')->onUpdate('cascade');
                $table->unsignedBigInteger('package_id')->nullable();
                $table->foreign('package_id')->references('id')->on('packages')->onDelete('SET NULL')->onUpdate('cascade');
                $table->unsignedBigInteger('currency_id')->nullable();
                $table->foreign('currency_id')->references('id')->on('global_currencies')->onDelete('cascade')->onUpdate('cascade');
                $table->string('package_type')->nullable();
                $table->string('plan_type')->nullable();
                $table->string('transaction_id')->nullable();
                $table->string('subscription_id')->nullable();
                $table->string('customer_id')->nullable();
                $table->string('name')->nullable();
                $table->string('user_id')->nullable();
                $table->string('quantity')->nullable();
                $table->string('token')->nullable();
                $table->string('razorpay_id')->nullable();
                $table->string('razorpay_plan')->nullable();
                $table->string('stripe_id')->nullable();
                $table->string('stripe_status')->nullable();
                $table->string('stripe_price')->nullable();
                $table->string('gateway_name')->nullable();
                $table->string('trial_ends_at')->nullable();
                $table->enum('subscription_status', ['active', 'inactive'])->nullable()->default(null);
                $table->dateTime('ends_at')->nullable();
                $table->dateTime('subscribed_on_date')->nullable();
                $table->string('flutterwave_id')->nullable();
                $table->string('flutterwave_payment_ref')->nullable();
                $table->string('flutterwave_status')->nullable();
                $table->string('flutterwave_customer_id')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('global_subscriptions');
    }
};