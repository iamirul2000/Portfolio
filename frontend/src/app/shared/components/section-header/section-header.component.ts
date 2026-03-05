import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="section-header" [class.centered]="centered">
      <h2 class="heading-2" [id]="headingId">{{ title }}</h2>
      <p *ngIf="subtitle" class="text-muted">{{ subtitle }}</p>
    </div>
  `,
  styles: [`
    .section-header {
      margin-bottom: var(--spacing-3xl);

      &.centered {
        text-align: center;
      }

      h2 {
        margin-bottom: var(--spacing-sm);
      }

      @media (max-width: 768px) {
        margin-bottom: var(--spacing-2xl);
      }
    }
  `]
})
export class SectionHeaderComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() centered: boolean = true;
  @Input() headingId: string = '';
}
