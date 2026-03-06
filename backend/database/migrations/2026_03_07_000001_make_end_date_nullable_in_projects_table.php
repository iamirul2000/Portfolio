<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // For SQLite, we need to recreate the table
        if (DB::getDriverName() === 'sqlite') {
            // Create temporary table with nullable end_date
            Schema::create('projects_temp', function (Blueprint $table) {
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

                $table->index('slug');
                $table->index('is_featured');
                $table->index('created_at');
            });

            // Copy data from old table to new table
            DB::statement('INSERT INTO projects_temp SELECT * FROM projects');

            // Drop old table
            Schema::dropIfExists('projects');

            // Rename temp table to projects
            Schema::rename('projects_temp', 'projects');
        } else {
            // For other databases, use change()
            Schema::table('projects', function (Blueprint $table) {
                $table->date('end_date')->nullable()->change();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Not reversible for SQLite without data loss
        if (DB::getDriverName() !== 'sqlite') {
            Schema::table('projects', function (Blueprint $table) {
                $table->date('end_date')->nullable(false)->change();
            });
        }
    }
};
