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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->string('role');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->json('highlights');
            $table->json('technologies');
            $table->string('repo_url', 500)->nullable();
            $table->string('live_url', 500)->nullable();
            $table->string('thumbnail_path', 500)->nullable();
            $table->boolean('is_featured')->default(false);
            $table->timestamps();

            // Indexes
            $table->index('slug');
            $table->index('is_featured');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
