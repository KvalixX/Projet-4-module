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
        Schema::create('patients', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('first_name');
            $table->string('last_name');
            $table->date('date_of_birth');
            $table->string('phone');
            $table->string('email')->unique();
            $table->text('address');
            $table->string('blood_type')->nullable();
            $table->json('allergies')->nullable();
            $table->text('medical_history')->nullable();
            $table->timestamp('registration_date')->useCurrent();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('email');
            $table->index(['first_name', 'last_name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
