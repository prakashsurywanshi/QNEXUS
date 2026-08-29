<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tenant_files', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->index('tenant_files_tenant_id_foreign');
            $table->string('filename')->nullable();
            $table->string('hashname', 200)->nullable();
            $table->string('size', 200)->nullable();
            $table->foreign(['tenant_id'])->references(['id'])->on('tenants')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tenant_files');
    }
};