<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('global_currencies')) {
            Schema::create('global_currencies', function (Blueprint $table) {
                $table->id();
                $table->string('currency_name', 191);
                $table->string('currency_symbol', 191);
                $table->string('currency_code', 191);
                $table->double('exchange_rate')->nullable();
                $table->double('usd_price')->nullable();
                $table->enum('is_cryptocurrency', ['yes', 'no'])->default('no');
                $table->enum('currency_position', ['left', 'right', 'left_with_space', 'right_with_space'])->default('left');
                $table->unsignedInteger('no_of_decimal')->default(2);
                $table->string('thousand_separator', 191)->nullable();
                $table->string('decimal_separator', 191)->nullable();
                $table->enum('status', ['enable', 'disable'])->default('enable');
                $table->timestamp('created_at')->nullable();
                $table->timestamp('updated_at')->nullable();
                $table->timestamp('deleted_at')->nullable();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('global_currencies');
    }
};