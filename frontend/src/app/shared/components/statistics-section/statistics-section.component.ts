import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimatedCounterComponent } from '../animated-counter/animated-counter.component';

export interface Statistic {
  value: number;
  label: string;
  suffix?: string;
}

@Component({
  selector: 'app-statistics-section',
  standalone: true,
  imports: [CommonModule, AnimatedCounterComponent],
  template: `
    <section class="statistics-section">
      <div class="statistics-grid">
        <app-animated-counter
          *ngFor="let stat of statistics"
          [endValue]="stat.value"
          [label]="stat.label"
          [suffix]="stat.suffix || ''"
          [duration]="2000">
        </app-animated-counter>
      </div>
    </section>
  `,
  styles: [`
    .statistics-section {
      padding: var(--spacing-2xl) var(--spacing-xl);
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius-lg);
      margin: var(--spacing-xl) auto var(--spacing-3xl) auto;
      max-width: var(--max-width);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
        opacity: 0.8;
      }

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 24px rgba(59, 130, 246, 0.2);
        border-color: var(--color-primary);
      }
    }

    .statistics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--spacing-xl);
      padding: 0;
    }

    @media (max-width: 768px) {
      .statistics-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: var(--spacing-lg);
      }
    }

    @media (max-width: 480px) {
      .statistics-grid {
        grid-template-columns: 1fr;
      }
    }

    :host-context(.light-theme) .statistics-section {
      background: var(--color-surface);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }
  `]
})
export class StatisticsSectionComponent {
  @Input() statistics: Statistic[] = [];
}
