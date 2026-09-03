<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('meter_topups', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('society_id')->nullable()->index();
            $table->unsignedBigInteger('meter_id');
            $table->unsignedBigInteger('apartment_id')->nullable();
            $table->decimal('amount', 12, 2)->default(0);
            $table->string('token')->nullable();
            $table->string('payment_method')->default('cash');
            $table->date('topup_date');
            $table->unsignedBigInteger('recorded_by')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('meter_id')->references('id')->on('meters')->onDelete('cascade');
            $table->foreign('apartment_id')->references('id')->on('apartment_managements')->onDelete('set null');
            $table->foreign('recorded_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('meter_topups');
    }
};
