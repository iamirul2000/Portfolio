import { Component, OnInit, inject } from '@angular/core';
import { SkillService } from '../core/services';
import { SkillsByCategory, Skill } from '../core/models';

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
  stats: any[] = [];
  floatingIcons = [
    { name: 'code', x: 10, delay: 0 },
    { name: 'terminal', x: 30, delay: 2 },
    { name: 'storage', x: 50, delay: 4 },
    { name: 'web', x: 70, delay: 6 },
    { name: 'build', x: 90, delay: 8 }
  ];

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
        this.calculateStats();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load skills. Please try again later.';
        this.loading = false;
        console.error('Error loading skills:', err);
      }
    });
  }

  calculateStats(): void {
    const totalSkills = Object.values(this.skillsByCategory).reduce((sum, skills) => sum + skills.length, 0);
    const expertSkills = Object.values(this.skillsByCategory).flat().filter(s => s.level === 'Expert').length;
    const categories = this.categories.length;

    this.stats = [
      { icon: 'code', value: totalSkills, label: 'Total Skills' },
      { icon: 'category', value: categories, label: 'Categories' },
      { icon: 'star', value: expertSkills, label: 'Expert Level' }
    ];
  }

  onSkillHover(skill: Skill): void {
    // Could add tooltip or additional info display
  }

  onSkillLeave(): void {
    // Clean up hover effects
  }

  getLevelPercentage(level: string | null): number {
    switch (level) {
      case 'Expert':
        return 95;
      case 'Advanced':
        return 80;
      case 'Intermediate':
        return 60;
      case 'Beginner':
        return 35;
      default:
        return 70; // Default for skills without level
    }
  }

  getLevelColor(level: string | null): string {
    switch (level) {
      case 'Expert':
        return 'rgba(52, 211, 153, 0.15)';
      case 'Advanced':
        return 'rgba(96, 165, 250, 0.15)';
      case 'Intermediate':
        return 'rgba(251, 146, 60, 0.15)';
      case 'Beginner':
        return 'rgba(156, 163, 175, 0.15)';
      default:
        return 'rgba(96, 165, 250, 0.15)';
    }
  }

  getTextColorForLevel(level: string | null): string {
    switch (level) {
      case 'Expert':
        return '#34D399';
      case 'Advanced':
        return '#60A5FA';
      case 'Intermediate':
        return '#FB923C';
      case 'Beginner':
        return '#9CA3AF';
      default:
        return '#60A5FA';
    }
  }

  getBorderColorForLevel(level: string | null): string {
    return this.getTextColorForLevel(level);
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
}


