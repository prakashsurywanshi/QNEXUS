<?php

use App\Models\Ticket;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('society_id')->nullable();
            $table->foreign('society_id')->references('id')->on('societies')->onDelete('cascade')->onUpdate('cascade');
            $table->bigInteger('ticket_number')->nullable();
            $table->unsignedBigInteger('user_id')->index('tickets_user_id_foreign');
            $table->foreign(['user_id'])->references(['id'])->on('users')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->unsignedBigInteger('type_id')->nullable()->index('ticket_type_id_foreign');
            $table->foreign(['type_id'])->references(['id'])->on('ticket_type_settings')->onUpdate('CASCADE')->onDelete('SET NULL');
            $table->enum('status', ['open', 'pending', 'resolved', 'closed'])->default('open');
            $table->unsignedBigInteger('agent_id')->nullable()->index('tickets_agent_id_foreign');
            $table->foreign(['agent_id'])->references(['id'])->on('users')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->text('subject')->nullable();
            $table->text('reply')->nullable();
            $table->timestamps();
        });

        $tickets = Ticket::get();

        foreach ($tickets as $key => $ticket) {
            $ticket->ticket_number = $key + 1;
            $ticket->saveQuietly();
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};