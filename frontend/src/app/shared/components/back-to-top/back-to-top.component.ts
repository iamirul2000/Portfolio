import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-back-to-top',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule],
  template: `
    <button 
      mat-fab 
      class="back-to-top"
      [class.visible]="isVisible()"
      [matTooltip]="'Back to top'"
      matTooltipPosition="left"
      aria-label="Scroll to top"
      (click)="scrollToTop()">
      <mat-icon>keyboard_arrow_up</mat-icon>
    </button>
  `,
  styles: [`
    .back-to-top {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      z-index: 1000;
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      color: white;
      opacity: 0;
      visibility: hidden;
      transform: translateY(20px) scale(0.8);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4);

      &.visible {
        opacity: 1;
        visibility: visible;
        transform: translateY(0) scale(1);
      }

      &:hover {
        transform: translateY(-4px) scale(1.05);
        box-shadow: 0 8px 30px rgba(59, 130, 246, 0.6);
      }

      &:active {
        transform: translateY(-2px) scale(0.98);
      }

      mat-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
      }

      @media (max-width: 768px) {
        bottom: 1rem;
        right: 1rem;
        width: 48px;
        height: 48px;

        mat-icon {
          font-size: 24px;
          width: 24px;
          height: 24px;
        }
      }
    }
  `]
})
export class BackToTopComponent {
  isVisible = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    this.isVisible.set(window.scrollY > 300);
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
