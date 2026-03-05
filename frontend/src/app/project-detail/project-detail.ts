import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../core/services';
import { Project } from '../core/models';

@Component({
  selector: 'app-project-detail',
  standalone: false,
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.scss',
})
export class ProjectDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private projectService = inject(ProjectService);

  project: Project | null = null;
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      if (slug) {
        this.loadProject(slug);
      }
    });
  }

  loadProject(slug: string): void {
    this.loading = true;
    this.error = null;

    this.projectService.getProjectBySlug(slug).subscribe({
      next: (response) => {
        this.project = response.data;
        this.loading = false;
      },
      error: (err) => {
        if (err.status === 404) {
          this.error = 'Project not found.';
        } else {
          this.error = 'Failed to load project. Please try again later.';
        }
        this.loading = false;
        console.error('Error loading project:', err);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/projects']);
  }

  formatDate(date: string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  getDateRange(): string {
    if (!this.project) return '';
    const start = this.formatDate(this.project.start_date);
    const end = this.formatDate(this.project.end_date);
    return `${start} - ${end}`;
  }
}

