import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProjectService } from '../../core/services/project.service';
import { Project } from '../../core/models/project.model';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDialogModule
  ],
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss']
})
export class ProjectsListComponent implements OnInit {
  private projectService = inject(ProjectService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  projects: Project[] = [];
  displayedColumns: string[] = ['title', 'technologies', 'featured', 'actions'];
  loading = true;
  totalItems = 0;
  pageSize = 15;
  currentPage = 1;

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;
    this.projectService.getAllProjects(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.projects = response.data;
        this.totalItems = response.meta.total;
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load projects', error);
        this.loading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadProjects();
  }

  createNew(): void {
    this.router.navigate(['/admin/projects/new']);
  }

  editProject(id: number): void {
    this.router.navigate([`/admin/projects/${id}/edit`]);
  }

  deleteProject(project: Project): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Project',
        message: `Are you sure you want to delete "${project.title}"? This action cannot be undone.`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projectService.deleteProject(project.id).subscribe({
          next: () => {
            this.loadProjects();
          },
          error: (error) => {
            console.error('Failed to delete project', error);
          }
        });
      }
    });
  }
}
