<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('societies', function (Blueprint $table) {
            $table->unsignedBigInteger('package_id')->nullable()->after('property_type');

            $table->foreign('package_id')->references('id')->on('packages')
                ->onDelete('SET NULL')->onUpdate('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('societies', function (Blueprint $table) {
            $table->dropForeign(['package_id']);
            $table->dropColumn(['package_id']);
        });
    }
};