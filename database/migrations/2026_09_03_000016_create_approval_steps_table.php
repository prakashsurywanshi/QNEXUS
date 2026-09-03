<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('approval_steps', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('approval_id');
            $table->foreign('approval_id')->references('id')->on('approvals')->onDelete('cascade')->onUpdate('cascade');
            $table->unsignedSmallInteger('step_number');
            $table->string('title');
            $table->text('description')->nullable();
            $table->unsignedBigInteger('assigned_to')->nullable();
            $table->foreign('assigned_to')->references('id')->on('users')->onDelete('set null');
            $table->enum('status', ['pending', 'in_progress', 'approved', 'rejected'])->default('pending');
            $table->unsignedBigInteger('decided_by')->nullable();
            $table->foreign('decided_by')->references('id')->on('users')->onDelete('set null');
            $table->text('decision_notes')->nullable();
            $table->timestamp('decided_at')->nullable();
            $table->timestamps();

            $table->index(['approval_id', 'step_number']);
        });

        Schema::create('approval_step_decisions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('approval_step_id');
            $table->foreign('approval_step_id')->references('id')->on('approval_steps')->onDelete('cascade')->onUpdate('cascade');
            $table->unsignedBigInteger('approval_id');
            $table->foreign('approval_id')->references('id')->on('approvals')->onDelete('cascade')->onUpdate('cascade');
            $table->unsignedBigInteger('decided_by');
            $table->foreign('decided_by')->references('id')->on('users')->onDelete('cascade');
            $table->enum('decision', ['approved', 'rejected']);
            $table->text('notes')->nullable();
            $table->timestamp('decided_at');
            $table->timestamps();

            $table->index(['approval_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('approval_step_decisions');
        Schema::dropIfExists('approval_steps');
    }
};
