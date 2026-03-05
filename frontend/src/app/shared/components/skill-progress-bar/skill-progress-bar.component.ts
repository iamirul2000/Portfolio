import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skill-progress-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skill-bar-wrapper">
      <div class="skill-header">
        <span class="skill-name">{{ skillName }}</span>
        <span class="skill-level">{{ level }}%</span>
      </div>
      <div class="skill-bar-track">
        <div 
          class="skill-bar-fill" 
          [style.width.%]="animatedLevel()"
          [class.beginner]="level < 40"
          [class.intermediate]="level >= 40 && level < 70"
          [class.advanced]="level >= 70">
        </div>
      </div>
    </div>
  `,
  styles: [`
    .skill-bar-wrapper {
      margin-bottom: var(--spacing-lg);
    }

    .skill-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-sm);
    }

    .skill-name {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-medium);
      color: var(--color-text);
    }

    .skill-level {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-primary);
    }

    .skill-bar-track {
      height: 8px;
      background: var(--color-border);
      border-radius: 4px;
      overflow: hidden;
      position: relative;
    }

    .skill-bar-fill {
      height: 100%;
      border-radius: 4px;
      transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .skill-bar-fill.beginner {
      background: linear-gradient(90deg, #ef4444, #f87171);
    }

    .skill-bar-fill.intermediate {
      background: linear-gradient(90deg, #f59e0b, #fbbf24);
    }

    .skill-bar-fill.advanced {
      background: linear-gradient(90deg, #10b981, #34d399);
    }

    .skill-bar-fill::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.3),
        transparent
      );
      animation: shimmer 2s infinite;
    }

    @keyframes shimmer {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(100%);
      }
    }

    :host-context(.light-theme) .skill-bar-track {
      background: rgba(0, 0, 0, 0.08);
    }
  `]
})
export class SkillProgressBarComponent implements OnInit {
  @Input() skillName: string = '';
  @Input() level: number = 0;
  @Input() animateOnView: boolean = true;

  animatedLevel = signal(0);
  private hasAnimated = false;

  ngOnInit(): void {
    if (this.animateOnView) {
      // Simulate intersection observer
      setTimeout(() => this.animate(), 100);
    } else {
      this.animatedLevel.set(this.level);
    }
  }

  private animate(): void {
    if (this.hasAnimated) return;
    this.hasAnimated = true;

    setTimeout(() => {
      this.animatedLevel.set(this.level);
    }, 50);
  }
}
