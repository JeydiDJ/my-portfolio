import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';

@Directive({ selector: '[appScrollAnimate]' })
export class ScrollAnimateDirective implements OnInit, OnDestroy {
  @Input() appScrollAnimate = 'up';
  @Input() revealDelay = 0;
  private observer?: IntersectionObserver;

  constructor(private el: ElementRef<HTMLElement>, private renderer: Renderer2) {}

  ngOnInit(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        typeof IntersectionObserver === 'undefined') { return; }
    const element = this.el.nativeElement;
    this.renderer.setAttribute(element, 'data-reveal', this.appScrollAnimate || 'up');
    this.renderer.setStyle(element, '--reveal-delay', `${this.revealDelay}ms`);
    this.renderer.addClass(element, 'motion-reveal');
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.renderer.addClass(element, 'is-visible');
        } else {
          this.renderer.removeClass(element, 'is-visible');
        }
      });
    }, { threshold: 0.08 });
    this.observer.observe(element);
  }

  ngOnDestroy(): void { this.observer?.disconnect(); }
}
