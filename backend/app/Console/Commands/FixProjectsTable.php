<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class FixProjectsTable extends Command
{
    protected $signature = 'fix:projects-table';
    protected $description = 'Fix projects table to make end_date nullable';

    public function handle()
    {
        $this->info('Fixing projects table...');

        try {
            // For SQLite, recreate the table
            if (DB::getDriverName() === 'sqlite') {
                $this->info('Detected SQLite database');
                
                // Create temporary table
                DB::statement('
                    CREATE TABLE projects_temp (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        title VARCHAR(255) NOT NULL,
                        slug VARCHAR(255) NOT NULL UNIQUE,
                        description TEXT NOT NULL,
                        role VARCHAR(255) NOT NULL,
                        start_date DATE NOT NULL,
                        end_date DATE NULL,
                        highlights TEXT NOT NULL,
                        technologies TEXT NOT NULL,
                        repo_url VARCHAR(500) NULL,
                        live_url VARCHAR(500) NULL,
                        thumbnail_path VARCHAR(500) NULL,
                        is_featured BOOLEAN DEFAULT 0,
                        created_at DATETIME NULL,
                        updated_at DATETIME NULL
                    )
                ');

                // Copy data
                DB::statement('INSERT INTO projects_temp SELECT * FROM projects');

                // Drop old table
                DB::statement('DROP TABLE projects');

                // Rename temp table
                DB::statement('ALTER TABLE projects_temp RENAME TO projects');

                // Recreate indexes
                DB::statement('CREATE INDEX projects_slug_index ON projects(slug)');
                DB::statement('CREATE INDEX projects_is_featured_index ON projects(is_featured)');
                DB::statement('CREATE INDEX projects_created_at_index ON projects(created_at)');

                $this->info('✓ Projects table fixed successfully!');
            } else {
                $this->error('This command only works with SQLite');
                return 1;
            }

            return 0;
        } catch (\Exception $e) {
            $this->error('Error: ' . $e->getMessage());
            return 1;
        }
    }
}
