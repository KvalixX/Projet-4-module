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
        Schema::create('treatments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('patient_id');
            $table->string('patient_name');
            $table->date('date');
            $table->string('type');
            $table->string('tooth')->nullable();
            $table->text('description');
            $table->decimal('cost', 10, 2);
            $table->uuid('dentist_id');
            $table->string('dentist_name');
            $table->json('prescriptions')->nullable();
            $table->date('next_visit')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->foreign('patient_id')->references('id')->on('patients')->onDelete('cascade');
            $table->foreign('dentist_id')->references('id')->on('staff')->onDelete('cascade');
            $table->index('date');
            $table->index('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('treatments');
    }
};
