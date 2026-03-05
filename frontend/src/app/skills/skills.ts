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
        return '#4caf50';
      case 'Advanced':
        return '#2196f3';
      case 'Intermediate':
        return '#ff9800';
      case 'Beginner':
        return '#9e9e9e';
      default:
        return '#1976d2';
    }
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


