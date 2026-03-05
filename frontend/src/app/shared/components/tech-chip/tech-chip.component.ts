import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tech-chip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span 
      class="tech-chip"
      [class.active]="active"
      [class.clickable]="clickable"
      [attr.role]="clickable ? 'button' : null"
      [attr.tabindex]="clickable ? 0 : null"
      [attr.aria-pressed]="clickable ? active : null">
      {{ label }}
    </span>
  `,
  styles: [`
    .tech-chip {
      display: inline-flex;
      align-items: center;
      padding: var(--spacing-xs) var(--spacing-md);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 999px;
      color: var(--color-text);
      transition: all var(--transition-fast);
      white-space: nowrap;

      &.clickable {
        cursor: pointer;

        &:hover {
          background: var(--color-primary);
          border-color: var(--color-primary);
          color: white;
          transform: translateY(-1px);
        }

        &:focus-visible {
          outline: 2px solid var(--color-primary);
          outline-offset: 2px;
        }
      }

      &.active {
        background: var(--color-primary);
        border-color: var(--color-primary);
        color: white;
      }
    }
  `]
})
export class TechChipComponent {
  @Input() label: string = '';
  @Input() active: boolean = false;
  @Input() clickable: boolean = false;
}
