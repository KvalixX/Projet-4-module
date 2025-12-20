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
        Schema::create('admin_notifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->enum('type', ['appointment_created', 'appointment_cancelled', 'appointment_modified', 'patient_registered']);
            $table->string('title');
            $table->text('message');
            $table->boolean('read')->default(false);
            $table->uuid('related_id')->nullable();
            $table->uuid('patient_id')->nullable();
            $table->timestamps();
            
            $table->index('read');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admin_notifications');
    }
};
