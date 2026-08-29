<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ticket_files', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->index('ticket_files_user_id_foreign');
            $table->foreign(['user_id'])->references(['id'])->on('users')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->unsignedBigInteger('ticket_reply_id')->index('ticket_files_ticket_reply_id_foreign');
            $table->foreign(['ticket_reply_id'])->references(['id'])->on('ticket_replies')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->string('filename');
            $table->string('hashname')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ticket_files');
    }
};