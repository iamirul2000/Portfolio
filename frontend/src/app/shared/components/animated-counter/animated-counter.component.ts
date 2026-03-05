import { Component, Input, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-animated-counter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="counter-wrapper">
      <div class="counter-value">{{ displayValue() }}{{ suffix }}</div>
      <div class="counter-label">{{ label }}</div>
    </div>
  `,
  styles: [`
    .counter-wrapper {
      text-align: center;
      padding: var(--spacing-lg);
    }

    .counter-value {
      font-size: clamp(2rem, 5vw, 3.5rem);
      font-weight: var(--font-weight-bold);
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: var(--spacing-sm);
      line-height: 1.2;
    }

    .counter-label {
      font-size: var(--font-size-base);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: var(--font-weight-medium);
    }

    :host-context(.light-theme) .counter-value {
      background: linear-gradient(135deg, #2563eb, #7c3aed);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  `]
})
export class AnimatedCounterComponent implements OnInit {
  @Input() endValue: number = 0;
  @Input() duration: number = 2000;
  @Input() suffix: string = '';
  @Input() label: string = '';
  @Input() startOnView: boolean = true;

  displayValue = signal(0);
  private hasAnimated = false;
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    if (this.startOnView) {
      this.setupIntersectionObserver();
    } else {
      this.animate();
    }
  }

  private setupIntersectionObserver(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.hasAnimated) {
            this.animate();
            this.hasAnimated = true;
          }
        });
      },
      { threshold: 0.5 }
    );

    // Note: In a real implementation, we'd observe the host element
    // For now, we'll just animate immediately
    setTimeout(() => this.animate(), 100);
  }

  private animate(): void {
    const startTime = Date.now();
    const startValue = 0;
    const endValue = this.endValue;

    const updateCounter = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / this.duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(startValue + (endValue - startValue) * easeOut);

      this.displayValue.set(currentValue);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        this.displayValue.set(endValue);
      }
    };

    requestAnimationFrame(updateCounter);
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
