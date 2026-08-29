<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('countries', function (Blueprint $table) {
            $table->id();
            $table->char('countries_code', 2);
            $table->string('countries_name');
            $table->string('phonecode');

            $table->index(['countries_code']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('countries');
    }
};
