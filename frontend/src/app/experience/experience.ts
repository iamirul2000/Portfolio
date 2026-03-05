import { Component, OnInit, inject } from '@angular/core';
import { ExperienceService } from '../core/services';
import { Experience as ExperienceModel } from '../core/models';

@Component({
  selector: 'app-experience',
  standalone: false,
  templateUrl: './experience.html',
  styleUrl: './experience.scss',
})
export class Experience implements OnInit {
  private experienceService = inject(ExperienceService);

  experiences: ExperienceModel[] = [];
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.loadExperiences();
  }

  loadExperiences(): void {
    this.loading = true;
    this.error = null;

    this.experienceService.getExperiences().subscribe({
      next: (response) => {
        this.experiences = response.data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load experiences. Please try again later.';
        this.loading = false;
        console.error('Error loading experiences:', err);
      }
    });
  }

  formatDate(date: string | null): string {
    if (!date) return 'Present';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  getDateRange(experience: ExperienceModel): string {
    const start = this.formatDate(experience.start_date);
    const end = experience.is_current ? 'Present' : this.formatDate(experience.end_date);
    return `${start} - ${end}`;
  }
}

