<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('offline_plan_changes')) {
            Schema::create('offline_plan_changes', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('society_id')->nullable();
                $table->foreign('society_id')->references('id')->on('societies')->onDelete('cascade')->onUpdate('cascade');
                $table->unsignedBigInteger('package_id');
                $table->foreign('package_id')->references('id')->on('packages')->onDelete('cascade')->onUpdate('cascade');
                $table->string('package_type');
                $table->double('amount')->nullable();
                $table->date('pay_date')->nullable();
                $table->date('next_pay_date')->nullable();
                $table->unsignedBigInteger('invoice_id')->nullable();
                $table->foreign('invoice_id')->references('id')->on('global_invoices')->onDelete('cascade')->onUpdate('cascade');
                $table->unsignedBigInteger('offline_method_id')->nullable();
                $table->foreign('offline_method_id')->references('id')->on('offline_payment_methods')->onDelete('cascade')->onUpdate('cascade');
                $table->string('file_name')->nullable();
                $table->enum('status', ['verified', 'pending', 'rejected'])->default('pending');
                $table->text('remark')->nullable();
                $table->mediumText('description');
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('offline_plan_changes');
    }
};