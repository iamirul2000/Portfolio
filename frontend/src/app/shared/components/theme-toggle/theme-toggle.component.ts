import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule],
  template: `
    <button 
      mat-icon-button 
      class="theme-toggle"
      [attr.aria-label]="'Switch to ' + (themeService.theme() === 'dark' ? 'light' : 'dark') + ' mode'"
      [matTooltip]="themeService.theme() === 'dark' ? 'Light mode' : 'Dark mode'"
      (click)="toggleTheme()">
      <mat-icon class="theme-icon">
        {{ themeService.theme() === 'dark' ? 'light_mode' : 'dark_mode' }}
      </mat-icon>
    </button>
  `,
  styles: [`
    .theme-toggle {
      position: relative;
      overflow: hidden;
      
      .theme-icon {
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      &:hover .theme-icon {
        transform: rotate(20deg) scale(1.1);
      }
      
      &:active .theme-icon {
        transform: rotate(20deg) scale(0.95);
      }
    }
  `]
})
export class ThemeToggleComponent {
  themeService = inject(ThemeService);

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
