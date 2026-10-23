import { Directive, ElementRef, Input, NgZone, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { gsap } from 'gsap';

@Directive({ selector: '[appScrollAnimate]' })
export class ScrollAnimateDirective implements OnInit, OnDestroy {
  @Input() appScrollAnimate = 'up';
  @Input() revealDelay = 0;
  private observer?: IntersectionObserver;
  private animationContext?: gsap.Context;
  private motionPreference?: MediaQueryList;
  private stopMotion = () => {
    if (!this.motionPreference?.matches) { return; }
    this.observer?.disconnect();
    this.animationContext?.revert();
    this.renderer.addClass(this.el.nativeElement, 'is-visible');
  };

  constructor(private el: ElementRef<HTMLElement>, private renderer: Renderer2, private zone: NgZone) {}

  ngOnInit(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        typeof IntersectionObserver === 'undefined') { return; }
    const element = this.el.nativeElement;
    this.motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.motionPreference.addEventListener?.('change', this.stopMotion);
    this.renderer.addClass(element, 'gsap-reveal');
    this.zone.runOutsideAngular(() => {
      this.animationContext = gsap.context(() => {
        gsap.set(element, {
          opacity: 0,
          x: this.appScrollAnimate === 'left' ? -40 : this.appScrollAnimate === 'right' ? 40 : 0,
          y: this.appScrollAnimate === 'scale' ? 20 : 40,
          scale: this.appScrollAnimate === 'scale' ? .94 : 1
        });
      }, element);
      this.observer = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) { return; }
        this.renderer.addClass(element, 'is-visible');
        this.animationContext?.add(() => {
          gsap.to(element, {
            opacity: 1, x: 0, y: 0, scale: 1, duration: .9,
            delay: this.revealDelay / 1000, ease: 'power3.out', clearProps: 'opacity,transform'
          });
        });
        this.observer?.unobserve(element);
      }, { threshold: .08 });
      this.observer.observe(element);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.animationContext?.revert();
    this.motionPreference?.removeEventListener?.('change', this.stopMotion);
  }
}
