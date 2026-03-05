import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appTypingAnimation]',
  standalone: true
})
export class TypingAnimationDirective implements OnInit, OnDestroy {
  @Input() texts: string[] = [];
  @Input() typingSpeed: number = 100;
  @Input() deletingSpeed: number = 50;
  @Input() pauseDuration: number = 2000;

  private currentIndex = 0;
  private currentText = '';
  private isDeleting = false;
  private timeoutId?: any;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    if (this.texts.length > 0) {
      this.type();
    }
  }

  private type(): void {
    const fullText = this.texts[this.currentIndex];

    if (this.isDeleting) {
      this.currentText = fullText.substring(0, this.currentText.length - 1);
    } else {
      this.currentText = fullText.substring(0, this.currentText.length + 1);
    }

    this.el.nativeElement.textContent = this.currentText;

    let timeout = this.isDeleting ? this.deletingSpeed : this.typingSpeed;

    if (!this.isDeleting && this.currentText === fullText) {
      timeout = this.pauseDuration;
      this.isDeleting = true;
    } else if (this.isDeleting && this.currentText === '') {
      this.isDeleting = false;
      this.currentIndex = (this.currentIndex + 1) % this.texts.length;
      timeout = 500;
    }

    this.timeoutId = setTimeout(() => this.type(), timeout);
  }

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}
