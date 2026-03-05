import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../core/services';
import { Profile } from '../core/models';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private profileService = inject(ProfileService);
  private router = inject(Router);

  profile: Profile | null = null;
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.error = null;

    this.profileService.getProfile().subscribe({
      next: (response) => {
        this.profile = response.data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load profile data. Please try again later.';
        this.loading = false;
        console.error('Error loading profile:', err);
      }
    });
  }

  navigateToProjects(): void {
    this.router.navigate(['/projects']);
  }

  navigateToContact(): void {
    this.router.navigate(['/contact']);
  }

  getSkillCategories(): string[] {
    return this.profile ? Object.keys(this.profile.skills_summary) : [];
  }

  formatDate(date: string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }
}
