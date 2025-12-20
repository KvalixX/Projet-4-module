<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('staff', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('first_name');
            $table->string('last_name');
            $table->enum('role', ['dentist', 'assistant', 'receptionist', 'admin']);
            $table->string('specialty')->nullable();
            $table->string('phone');
            $table->string('email')->unique();
            $table->json('schedule')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('email');
            $table->index('role');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('staff');
    }
};
