import { Component, OnInit, inject } from '@angular/core';
import { ProfileService } from '../core/services';
import { Profile } from '../core/models';

interface Education {
  degree: string;
  institution: string;
  cgpa: string;
  years: string;
}

interface FunFact {
  icon: string;
  label: string;
  value: string;
  color: string;
}

interface TopSkill {
  name: string;
  icon: string;
  category: string;
  color: string;
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

  // Stats for animated counters
  stats = [
    { value: 2, label: 'Years Experience', suffix: '+', icon: 'work_history' },
    { value: 10, label: 'Projects Completed', suffix: '+', icon: 'rocket_launch' },
    { value: 15, label: 'Technologies', suffix: '+', icon: 'code' },
    { value: 100, label: 'Commits This Year', suffix: '+', icon: 'cloud_upload' }
  ];

  // Fun facts about you
  funFacts: FunFact[] = [
    { icon: 'code', label: 'Favorite Stack', value: 'Angular + Laravel', color: '#3b82f6' },
    { icon: 'schedule', label: 'Coding Hours', value: '8+ hours daily', color: '#10b981' },
    { icon: 'language', label: 'Languages', value: 'English, Malay', color: '#f59e0b' },
    { icon: 'psychology', label: 'Learning', value: 'Always curious', color: '#8b5cf6' },
    { icon: 'sports_esports', label: 'Hobby', value: 'Gaming & Tech', color: '#ec4899' }
  ];

  // Top skills to highlight
  topSkills: TopSkill[] = [
    { name: 'Angular', icon: 'web', category: 'Frontend', color: '#dd0031' },
    { name: 'Laravel', icon: 'api', category: 'Backend', color: '#ff2d20' },
    { name: 'TypeScript', icon: 'code', category: 'Language', color: '#3178c6' },
    { name: 'PHP', icon: 'terminal', category: 'Language', color: '#777bb4' },
    { name: 'MySQL', icon: 'storage', category: 'Database', color: '#4479a1' },
    { name: 'Git', icon: 'source', category: 'Tools', color: '#f05032' },
    { name: 'Docker', icon: 'cloud', category: 'DevOps', color: '#2496ed' },
    { name: 'REST API', icon: 'sync_alt', category: 'Integration', color: '#10b981' }
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

