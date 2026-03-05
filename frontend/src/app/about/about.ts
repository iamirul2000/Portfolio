import { Component, OnInit, inject } from '@angular/core';
import { ProfileService } from '../core/services';
import { Profile } from '../core/models';

interface Education {
  degree: string;
  institution: string;
  cgpa: string;
  years: string;
}

@Component({
  selector: 'app-about',
  standalone: false,
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About implements OnInit {
  private profileService = inject(ProfileService);

  profile: Profile | null = null;
  loading = true;
  error: string | null = null;

  education: Education[] = [
    {
      degree: 'Bachelor of Computer Science (Hons.) Netcentric Computing',
      institution: 'Universiti Teknologi MARA (UiTM)',
      cgpa: '3.22',
      years: '2021-2023'
    },
    {
      degree: 'Diploma of Computer Science',
      institution: 'Universiti Teknologi MARA (UiTM)',
      cgpa: '3.68',
      years: '2018-2021'
    }
  ];

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
}

