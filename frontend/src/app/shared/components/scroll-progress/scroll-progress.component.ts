import { Component, OnInit, OnDestroy, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scroll-progress',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="scroll-progress-container">
      <div 
        class="scroll-progress-bar" 
        [style.width.%]="scrollProgress()">
      </div>
    </div>
  `,
  styles: [`
    .scroll-progress-container {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: rgba(255, 255, 255, 0.1);
      z-index: 9999;
      pointer-events: none;
    }

    .scroll-progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
      transition: width 0.1s ease-out;
      box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
    }

    :host-context(.light-theme) .scroll-progress-container {
      background: rgba(0, 0, 0, 0.05);
    }
  `]
})
export class ScrollProgressComponent implements OnInit, OnDestroy {
  scrollProgress = signal(0);
  private rafId?: number;

  ngOnInit(): void {
    this.updateProgress();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    this.rafId = requestAnimationFrame(() => this.updateProgress());
  }

  private updateProgress(): void {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    
    const totalScroll = documentHeight - windowHeight;
    const progress = totalScroll > 0 ? (scrollTop / totalScroll) * 100 : 0;
    
    this.scrollProgress.set(Math.min(100, Math.max(0, progress)));
  }

  ngOnDestroy(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }
}
