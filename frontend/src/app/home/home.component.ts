import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService, ProjectService, ExperienceService } from '../core/services';
import { Profile } from '../core/models';
import { Statistic } from '../shared/components/statistics-section/statistics-section.component';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private profileService = inject(ProfileService);
  private projectService = inject(ProjectService);
  private experienceService = inject(ExperienceService);
  private router = inject(Router);

  profile: Profile | null = null;
  loading = true;
  error: string | null = null;
  
  // Statistics data
  statistics: Statistic[] = [];
  
  // Typing animation texts
  typingTexts: string[] = [
    'Full Stack Developer',
    'Angular Specialist',
    'Laravel Expert',
    'Problem Solver'
  ];

  // Particles for animated background
  particles = Array.from({ length: 30 }, (_, i) => ({
    x: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 15 + Math.random() * 10
  }));

  // Tech stack badges
  techStack = ['Angular', 'Laravel', 'PHP', 'TypeScript', 'MySQL', 'Docker'];

  ngOnInit(): void {
    this.loadProfile();
    this.loadStatistics();
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

  loadStatistics(): void {
    // Calculate years of experience (assuming started in 2021)
    const startYear = 2021;
    const currentYear = new Date().getFullYear();
    const yearsOfExperience = currentYear - startYear;

    // Load project count
    this.projectService.getProjects().subscribe({
      next: (response) => {
        const projectCount = response.data.length;
        
        // Load experience count
        this.experienceService.getExperiences().subscribe({
          next: (expResponse) => {
            const companiesCount = expResponse.data.length;
            
            this.statistics = [
              { value: yearsOfExperience, label: 'Years Experience', suffix: '+' },
              { value: projectCount, label: 'Projects Completed', suffix: '+' },
              { value: companiesCount, label: 'Companies Worked', suffix: '' },
              { value: 15, label: 'Technologies', suffix: '+' }
            ];
          }
        });
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

  getCategoryIcon(category: string): string {
    const categoryLower = category.toLowerCase();
    
    if (categoryLower.includes('backend')) return 'storage';
    if (categoryLower.includes('frontend')) return 'web';
    if (categoryLower.includes('mobile')) return 'phone_android';
    if (categoryLower.includes('database')) return 'dns';
    if (categoryLower.includes('tool')) return 'build';
    
    return 'code';
  }

  formatDate(date: string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }
}
