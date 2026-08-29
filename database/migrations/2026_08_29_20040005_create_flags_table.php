<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('flags')) {
            Schema::create('flags', function (Blueprint $table) {
                $table->id();
                $table->string('capital')->nullable();
                $table->string('code')->nullable();
                $table->string('continent')->nullable();
                $table->string('name')->nullable();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('flags');
    }
};
