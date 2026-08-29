<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('apartment_tenant', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id');
            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade')->onUpdate('cascade');
            $table->unsignedBigInteger('apartment_id');
            $table->foreign('apartment_id')->references('id')->on('apartment_managements')->onDelete('cascade')->onUpdate('cascade');
            $table->date('contract_start_date')->nullable();
            $table->date('contract_end_date')->nullable();
            $table->double('rent_amount', 16, 2)->nullable();
            $table->enum('rent_billing_cycle', ['monthly', 'annually'])->default('monthly');
            $table->enum('status', ['current_resident', 'left'])->default('current_resident');
            $table->date('move_in_date')->nullable();
            $table->date('move_out_date')->nullable();
            $table->timestamps();
            $table->unique(['tenant_id', 'apartment_id'], 'tenant_apartment_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('apartment_tenant');
    }
};