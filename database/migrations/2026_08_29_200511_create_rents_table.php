<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rents', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('society_id')->nullable();
            $table->foreign('society_id')->references('id')->on('societies')->onDelete('cascade')->onUpdate('cascade');
            $table->unsignedBigInteger('apartment_id');
            $table->foreign('apartment_id')->references('id')->on('apartment_managements')->onDelete('cascade')->onUpdate('cascade');
            $table->unsignedBigInteger('tenant_id')->nullable();
            $table->foreign(['tenant_id'])->references(['id'])->on('tenants')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->string('rent_for_year')->nullable();
            $table->string('rent_for_month')->nullable();
            $table->double('rent_amount', 16, 2);
            $table->enum('status', ['paid', 'unpaid'])->nullable();
            $table->date('payment_date')->nullable();
            $table->string('payment_proof', 2048)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rents');
    }
};