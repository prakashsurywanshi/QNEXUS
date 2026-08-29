<?php

use App\Enums\PackageType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('packages', function (Blueprint $table) {
            $table->id();
            $table->string('package_name');
            $table->double('price')->nullable();
            $table->string('description')->nullable();
            $table->unsignedBigInteger('currency_id')->nullable();
            $table->foreign('currency_id')->references('id')->on('global_currencies')->onDelete('SET NULL')->onUpdate('cascade');
            $table->decimal('annual_price')->nullable();
            $table->decimal('monthly_price')->nullable();
            $table->string('monthly_status')->nullable()->default(1);
            $table->string('annual_status')->nullable()->default(1);
            $table->string('stripe_annual_plan_id')->nullable();
            $table->string('stripe_monthly_plan_id')->nullable();
            $table->string('razorpay_annual_plan_id')->nullable();
            $table->string('razorpay_monthly_plan_id')->nullable();
            $table->string('flutterwave_annual_plan_id')->nullable();
            $table->string('flutterwave_monthly_plan_id')->nullable();
            $table->string('paystack_annual_plan_id')->nullable();
            $table->string('paystack_monthly_plan_id')->nullable();
            $table->unsignedTinyInteger('billing_cycle')->nullable();
            $table->unsignedInteger('sort_order')->nullable();
            $table->boolean('is_private')->default(0);
            $table->boolean('is_free')->default(0);
            $table->boolean('is_recommended')->default(0);
            $table->string('package_type')->default(PackageType::STANDARD);
            $table->boolean('trial_status')->nullable();
            $table->integer('trial_days')->nullable();
            $table->integer('trial_notification_before_days')->nullable();
            $table->string('trial_message')->nullable();
            $table->longText('additional_features')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('packages');
    }
};