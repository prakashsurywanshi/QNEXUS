<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('fixed_deposits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('society_id')->nullable()->constrained('societies')->nullOnDelete();
            $table->string('bank_name');
            $table->string('fd_number');
            $table->decimal('amount', 12, 2);
            $table->decimal('interest_rate', 5, 2);
            $table->date('start_date');
            $table->date('maturity_date');
            $table->enum('status', ['active', 'matured', 'renewed', 'losed'])->default('active');
            $table->string('renewal_action')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fixed_deposits');
    }
};
