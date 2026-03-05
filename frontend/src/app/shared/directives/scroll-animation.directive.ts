import { Directive, ElementRef, Input, OnInit, OnDestroy, Renderer2 } from '@angular/core';

export type AnimationType = 'fade-in' | 'slide-up' | 'slide-left' | 'slide-right' | 'scale' | 'none';

@Directive({
  selector: '[appScrollAnimation]',
  standalone: true
})
export class ScrollAnimationDirective implements OnInit, OnDestroy {
  @Input() appScrollAnimation: AnimationType = 'fade-in';
  @Input() animationDelay: number = 0;
  @Input() animationDuration: number = 600;
  @Input() threshold: number = 0.1;

  private observer?: IntersectionObserver;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    // Set initial state
    this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
    this.renderer.setStyle(this.el.nativeElement, 'transition', 
      `all ${this.animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1) ${this.animationDelay}ms`
    );

    // Apply initial transform based on animation type
    this.applyInitialTransform();

    // Create intersection observer
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animate();
          }
        });
      },
      {
        threshold: this.threshold,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    this.observer.observe(this.el.nativeElement);
  }

  private applyInitialTransform(): void {
    switch (this.appScrollAnimation) {
      case 'slide-up':
        this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(30px)');
        break;
      case 'slide-left':
        this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateX(30px)');
        break;
      case 'slide-right':
        this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateX(-30px)');
        break;
      case 'scale':
        this.renderer.setStyle(this.el.nativeElement, 'transform', 'scale(0.9)');
        break;
    }
  }

  private animate(): void {
    this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'translate(0, 0) scale(1)');
    
    // Disconnect observer after animation
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
