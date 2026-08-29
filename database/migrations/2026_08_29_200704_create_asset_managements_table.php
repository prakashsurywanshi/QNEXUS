<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('asset_managements', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('society_id')->nullable();
            $table->foreign('society_id')->references('id')->on('societies')->onDelete('cascade')->onUpdate('cascade');
            $table->string('name')->nullable();
            $table->unsignedBigInteger('category_id')->nullable();
            $table->foreign('category_id')->references('id')->on('asset_categories')->onDelete('cascade')->onUpdate('cascade');
            $table->string('location')->nullable();
            $table->string('condition')->nullable();
            $table->foreignId('tower_id')->constrained()->onDelete('cascade')->onUpdate('cascade')->nullable();
            $table->foreignId('floor_id')->nullable()->constrained()->onDelete('cascade')->onUpdate('cascade');
            $table->unsignedBigInteger('apartment_id')->nullable();
            $table->foreign('apartment_id')->references('id')->on('apartment_managements')->onDelete('cascade')->onUpdate('cascade');
            $table->string('file_path')->nullable();
            $table->date('purchase_date')->nullable();
            $table->enum('maintenance_schedule', ['weekly', 'biweekly', 'monthly', 'half-year', 'yearly'])->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('asset_managements');
    }
};