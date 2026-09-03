<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('family_members', function (Blueprint $table) {
            $table->unsignedBigInteger('society_id')->nullable()->after('user_id');
            $table->string('relationship')->nullable()->after('name');
            $table->string('phone')->nullable()->after('relationship');
            $table->string('document_type')->nullable()->after('phone');
            $table->string('document')->nullable()->after('document_type');
        });
    }

    public function down(): void
    {
        Schema::table('family_members', function (Blueprint $table) {
            $table->dropColumn(['society_id', 'relationship', 'phone', 'document_type', 'document']);
        });
    }
};
