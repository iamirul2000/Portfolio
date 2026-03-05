import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../core/services';
import { Project } from '../core/models';

@Component({
  selector: 'app-projects',
  standalone: false,
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects implements OnInit {
  private projectService = inject(ProjectService);
  private router = inject(Router);

  projects: Project[] = [];
  loading = true;
  error: string | null = null;
  
  // Filter state
  showFeaturedOnly = false;
  
  // Pagination state
  currentPage = 1;
  totalPages = 1;
  totalProjects = 0;

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;
    this.error = null;

    const featured = this.showFeaturedOnly ? true : undefined;

    this.projectService.getProjects(featured, this.currentPage).subscribe({
      next: (response) => {
        this.projects = response.data;
        this.currentPage = response.meta.current_page;
        this.totalPages = response.meta.last_page;
        this.totalProjects = response.meta.total;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load projects. Please try again later.';
        this.loading = false;
        console.error('Error loading projects:', err);
      }
    });
  }

  toggleFeatured(): void {
    this.showFeaturedOnly = !this.showFeaturedOnly;
    this.currentPage = 1;
    this.loadProjects();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadProjects();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  viewProject(project: Project): void {
    this.router.navigate(['/projects', project.slug]);
  }
}

