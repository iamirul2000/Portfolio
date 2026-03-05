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
import { ExperienceService } from '../../core/services/experience.service';
import { Experience } from '../../core/models/experience.model';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-experiences-list',
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
  templateUrl: './experiences-list.component.html',
  styleUrls: ['./experiences-list.component.scss']
})
export class ExperiencesListComponent implements OnInit {
  private experienceService = inject(ExperienceService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  experiences: Experience[] = [];
  displayedColumns: string[] = ['company', 'role', 'dates', 'actions'];
  loading = true;
  totalItems = 0;
  pageSize = 15;
  currentPage = 1;

  ngOnInit(): void {
    this.loadExperiences();
  }

  loadExperiences(): void {
    this.loading = true;
    this.experienceService.getAllExperiences(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.experiences = response.data;
        this.totalItems = response.meta.total;
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load experiences', error);
        this.loading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadExperiences();
  }

  createNew(): void {
    this.router.navigate(['/admin/experiences/new']);
  }

  editExperience(id: number): void {
    this.router.navigate([`/admin/experiences/${id}/edit`]);
  }

  deleteExperience(experience: Experience): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Experience',
        message: `Are you sure you want to delete "${experience.company_name} - ${experience.role_title}"? This action cannot be undone.`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.experienceService.deleteExperience(experience.id).subscribe({
          next: () => {
            this.loadExperiences();
          },
          error: (error) => {
            console.error('Failed to delete experience', error);
          }
        });
      }
    });
  }

  formatDateRange(experience: Experience): string {
    const startDate = new Date(experience.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    const endDate = experience.is_current ? 'Present' : new Date(experience.end_date!).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    return `${startDate} - ${endDate}`;
  }
}
