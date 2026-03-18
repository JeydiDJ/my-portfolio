import { Directive, ElementRef, HostListener, Renderer2, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appScrollAnimate]'
})
export class ScrollAnimateDirective implements OnInit {
  @Input() speed = 0.2; // slide speed factor
  @Input() darkColor = 'rgba(20,20,20,1)'; // color to fade into

  private elTop = 0;
  private elHeight = 0;
  private windowHeight = window.innerHeight;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.updateElementMetrics();
    this.applyAnimation();
  }

  @HostListener('window:resize')
  onResize() {
    this.updateElementMetrics();
    this.applyAnimation();
  }

  @HostListener('window:scroll')
  onScroll() {
    this.applyAnimation();
  }

  private updateElementMetrics() {
    const rect = this.el.nativeElement.getBoundingClientRect();
    this.elTop = rect.top + window.scrollY;
    this.elHeight = rect.height;
    this.windowHeight = window.innerHeight;
  }

  private applyAnimation() {
    const scrollY = window.scrollY;
    const centerViewport = scrollY + this.windowHeight / 2;
    const distance = centerViewport - (this.elTop + this.elHeight / 2);

    // normalize -1 to 1
    const offset = distance / (this.windowHeight / 2);
    const clamped = Math.max(Math.min(offset, 1), -1);

    // translate element vertically
    const translateY = clamped * this.elHeight * this.speed;
    this.renderer.setStyle(
      this.el.nativeElement,
      'transform',
      `translateY(${translateY}px)`
    );

    // fade to dark: interpolate based on distance
    const fadeAmount = Math.min(Math.abs(clamped), 1); // 0 center → 1 far away
    this.renderer.setStyle(
      this.el.nativeElement,
      'background-color',
      `rgba(20, 20, 20, ${fadeAmount})`
    );

    this.renderer.setStyle(
      this.el.nativeElement,
      'transition',
      'transform 0.3s, background-color 0.3s'
    );
  }
}