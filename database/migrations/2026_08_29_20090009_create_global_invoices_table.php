<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('global_invoices')) {
            Schema::create('global_invoices', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('society_id')->nullable();
                $table->foreign('society_id')->references('id')->on('societies')->onDelete('cascade')->onUpdate('cascade');
                $table->unsignedBigInteger('currency_id')->nullable();
                $table->foreign('currency_id')->references('id')->on('global_currencies')->onDelete('cascade')->onUpdate('cascade');
                $table->unsignedBigInteger('package_id')->nullable();
                $table->foreign('package_id')->references('id')->on('packages')->onDelete('cascade')->onUpdate('cascade');
                $table->unsignedBigInteger('global_subscription_id')->nullable();
                $table->foreign('global_subscription_id')->references('id')->on('global_subscriptions')->onDelete('cascade')->onUpdate('cascade');
                $table->unsignedBigInteger('offline_method_id')->nullable();
                $table->foreign('offline_method_id')->references('id')->on('offline_payment_methods')->onDelete('cascade')->onUpdate('cascade');
                $table->string('signature')->nullable();
                $table->string('token')->nullable();
                $table->string('transaction_id')->nullable();
                $table->string('package_type')->nullable();
                $table->integer('sub_total')->nullable();
                $table->integer('total')->nullable();
                $table->string('billing_frequency')->nullable();
                $table->string('billing_interval')->nullable();
                $table->enum('recurring', ['yes', 'no'])->nullable()->default(null);
                $table->string('plan_id')->nullable();
                $table->string('subscription_id')->nullable();
                $table->string('invoice_id')->nullable();
                $table->double('amount')->nullable();
                $table->string('stripe_invoice_number')->nullable();
                $table->dateTime('pay_date')->nullable();
                $table->dateTime('next_pay_date')->nullable();
                $table->string('gateway_name')->nullable();
                $table->enum('status', ['active', 'inactive'])->nullable()->default(null);
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('global_invoices');
    }
};