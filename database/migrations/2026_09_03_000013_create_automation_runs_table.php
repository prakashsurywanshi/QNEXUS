<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('automation_runs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('automation_id');
            $table->unsignedBigInteger('society_id')->nullable()->index();
            $table->string('subject_type');
            $table->unsignedBigInteger('subject_id');
            $table->string('action');
            $table->string('result')->default('success');
            $table->timestamp('fired_at');
            $table->timestamps();

            $table->unique(['automation_id', 'subject_type', 'subject_id'], 'automation_subject_unique');
            $table->foreign('automation_id')->references('id')->on('automations')->onDelete('cascade');
            $table->foreign('society_id')->references('id')->on('societies')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('automation_runs');
    }
};
