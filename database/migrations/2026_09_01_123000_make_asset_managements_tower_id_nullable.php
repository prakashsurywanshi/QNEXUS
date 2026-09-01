<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('asset_managements', function (Blueprint $table) {
            $table->unsignedBigInteger('tower_id')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('asset_managements', function (Blueprint $table) {
            $table->unsignedBigInteger('tower_id')->nullable(false)->change();
        });
    }
};