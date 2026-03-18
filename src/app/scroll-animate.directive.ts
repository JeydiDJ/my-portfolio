import { Directive, ElementRef, Renderer2, Input, OnInit, HostListener } from '@angular/core';

@Directive({
  selector: '[appScrollAnimate]'
})
export class ScrollAnimateDirective implements OnInit {
  @Input() speed = 0.2; // vertical slide factor
  @Input() darkColor = 'rgba(20,20,20,1)'; // fade-to-dark color
  @Input() rotateAxis: 'X' | 'Y' = 'X'; // axis to rotate
  @Input() maxRotation = 25; // max degrees rotation
  @Input() smoothFactor = 0.2; // smoothing for fast scroll

  private elTop = 0;
  private elHeight = 0;
  private windowHeight = window.innerHeight;

  private currentTranslateY = 0;
  private currentRotate = 0;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.updateElementMetrics();

    // Set initial transform and background to prevent white space
    this.renderer.setStyle(this.el.nativeElement, 'transform', `translateY(0px) rotate${this.rotateAxis}(0deg)`);
    this.renderer.setStyle(this.el.nativeElement, 'background-color', 'rgba(20,20,20,0)');

    // small timeout ensures layout is fully rendered before first RAF
    setTimeout(() => this.animate(), 50);
  }

  @HostListener('window:resize')
  onResize() {
    this.updateElementMetrics();
  }

  private updateElementMetrics() {
    const rect = this.el.nativeElement.getBoundingClientRect();
    this.elTop = rect.top + window.scrollY;
    this.elHeight = rect.height;
    this.windowHeight = window.innerHeight;

    // enable smooth 3D
    this.renderer.setStyle(this.el.nativeElement, 'transform-style', 'preserve-3d');
    this.renderer.setStyle(this.el.nativeElement, 'backface-visibility', 'hidden');
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'background-color 0.3s ease-out');
  }

  private animate() {
    const scrollY = window.scrollY;
    const centerViewport = scrollY + this.windowHeight / 2;
    const distance = centerViewport - (this.elTop + this.elHeight / 2);

    const offset = distance / (this.windowHeight / 2);
    const clamped = Math.max(Math.min(offset, 1), -1);

    // translation
    const maxTranslate = this.windowHeight / 2;
    const targetTranslateY = Math.max(Math.min(clamped * this.elHeight * this.speed, maxTranslate), -maxTranslate);

    // rotation
    const targetRotate = clamped * this.maxRotation;

    // smooth interpolation
    this.currentTranslateY += (targetTranslateY - this.currentTranslateY) * this.smoothFactor;
    this.currentRotate += (targetRotate - this.currentRotate) * this.smoothFactor;

    // apply transform
    this.renderer.setStyle(
      this.el.nativeElement,
      'transform',
      `translateY(${this.currentTranslateY}px) rotate${this.rotateAxis}(${this.currentRotate}deg)`
    );

    // fade to dark
    const fadeAmount = Math.min(Math.abs(clamped), 1);
    this.renderer.setStyle(
      this.el.nativeElement,
      'background-color',
      `rgba(20,20,20,${fadeAmount})`
    );

    requestAnimationFrame(() => this.animate());
  }
}