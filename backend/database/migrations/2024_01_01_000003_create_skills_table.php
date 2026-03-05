<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class() extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('skills', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('category', ['Backend', 'Frontend', 'Mobile', 'Database', 'Tools']);
            $table->enum('level', ['Beginner', 'Intermediate', 'Advanced', 'Expert'])->nullable();
            $table->integer('order')->default(0);
            $table->timestamps();

            // Indexes
            $table->index('category');
            $table->index('order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('skills');
    }
};
