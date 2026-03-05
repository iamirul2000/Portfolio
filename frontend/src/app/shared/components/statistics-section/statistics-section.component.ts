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
      padding: var(--spacing-4xl) 0;
      background: linear-gradient(135deg, 
        rgba(59, 130, 246, 0.05) 0%, 
        rgba(139, 92, 246, 0.05) 100%);
      border-radius: var(--border-radius-lg);
      margin: var(--spacing-3xl) 0;
    }

    .statistics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--spacing-xl);
      max-width: var(--max-width);
      margin: 0 auto;
      padding: 0 var(--spacing-md);
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
      background: linear-gradient(135deg, 
        rgba(59, 130, 246, 0.08) 0%, 
        rgba(139, 92, 246, 0.08) 100%);
    }
  `]
})
export class StatisticsSectionComponent {
  @Input() statistics: Statistic[] = [];
}
