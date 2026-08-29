<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('package_modules')) {
            Schema::create('package_modules', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('package_id')->nullable();
                $table->foreign('package_id')->references('id')->on('packages')->onDelete('cascade')->onUpdate('cascade');
                $table->unsignedBigInteger('module_id')->nullable();
                $table->foreign('module_id')->references('id')->on('modules')->onDelete('cascade')->onUpdate('cascade');
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('package_modules');
    }
};