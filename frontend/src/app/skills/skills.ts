import { Component, OnInit, inject } from '@angular/core';
import { SkillService } from '../core/services';
import { SkillsByCategory } from '../core/models';

@Component({
  selector: 'app-skills',
  standalone: false,
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
})
export class Skills implements OnInit {
  private skillService = inject(SkillService);

  skillsByCategory: SkillsByCategory = {};
  categories: string[] = [];
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.loadSkills();
  }

  loadSkills(): void {
    this.loading = true;
    this.error = null;

    this.skillService.getSkills().subscribe({
      next: (response) => {
        this.skillsByCategory = response.data;
        this.categories = Object.keys(this.skillsByCategory);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load skills. Please try again later.';
        this.loading = false;
        console.error('Error loading skills:', err);
      }
    });
  }

  getLevelColor(level: string | null): string {
    switch (level) {
      case 'Expert':
        return 'rgba(52, 211, 153, 0.15)'; // Green with transparency
      case 'Advanced':
        return 'rgba(96, 165, 250, 0.15)'; // Blue with transparency
      case 'Intermediate':
        return 'rgba(251, 146, 60, 0.15)'; // Orange with transparency
      case 'Beginner':
        return 'rgba(156, 163, 175, 0.15)'; // Gray with transparency
      default:
        return 'rgba(96, 165, 250, 0.15)'; // Default blue
    }
  }

  getTextColorForLevel(level: string | null): string {
    switch (level) {
      case 'Expert':
        return '#34D399'; // Bright green
      case 'Advanced':
        return '#60A5FA'; // Bright blue
      case 'Intermediate':
        return '#FB923C'; // Bright orange
      case 'Beginner':
        return '#9CA3AF'; // Light gray
      default:
        return '#60A5FA'; // Default bright blue
    }
  }

  getBorderColorForLevel(level: string | null): string {
    return this.getTextColorForLevel(level);
  }

  getCategoryIcon(category: string): string {
    switch (category) {
      case 'Backend':
        return 'storage';
      case 'Frontend':
        return 'web';
      case 'Mobile':
        return 'phone_android';
      case 'Database':
        return 'database';
      case 'Tools':
        return 'build';
      default:
        return 'code';
    }
  }
}


