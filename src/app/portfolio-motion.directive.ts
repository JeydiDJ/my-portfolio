import { AfterViewInit, Directive, ElementRef, NgZone, OnDestroy } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Page choreography is scoped here so navigation and component state stay independent. */
@Directive({ selector: '[appPortfolioMotion]' })
export class PortfolioMotionDirective implements AfterViewInit, OnDestroy {
  private media?: gsap.MatchMedia;
  private destroyed = false;

  constructor(private host: ElementRef<HTMLElement>, private zone: NgZone) {}

  ngAfterViewInit(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { return; }
    this.zone.runOutsideAngular(() => {
      const root = this.host.nativeElement;
      this.media = gsap.matchMedia();
      this.media.add('(prefers-reduced-motion: no-preference)', () => {
        root.classList.add('studio-motion');
        const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
        intro.fromTo(root.querySelectorAll('.word-clip > span'),
          { yPercent: 115, rotation: 5 }, { yPercent: 0, rotation: 0, duration: 1.15, stagger: .14, clearProps: 'transform' }, .12)
          .fromTo(root.querySelectorAll('.availability, .hero-terminal, .hero-summary, .hero-actions, .hero-location'),
            { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .8, stagger: .11, clearProps: 'opacity,transform' }, .22)
          .fromTo(root.querySelector('.portrait-frame'),
            { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'power4.inOut', clearProps: 'clipPath' }, .05)
          .fromTo(root.querySelector('.portrait-frame img'),
            { scale: 1.2 }, { scale: 1, duration: 1.65, clearProps: 'transform' }, .05)
          .fromTo(root.querySelectorAll('.portrait-caption, .hero-bottom'),
            { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .8, stagger: .12, clearProps: 'opacity,transform' }, .9);

        root.querySelectorAll<HTMLElement>('.project-cover').forEach(cover => {
          gsap.fromTo(cover, { clipPath: 'inset(0% 0% 100% 0%)' }, {
            clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'power3.inOut', clearProps: 'clipPath',
            scrollTrigger: { trigger: root.querySelector('#projects'), start: 'top 80%', once: true }
          });
        });

        root.querySelectorAll<HTMLElement>('.skill-category').forEach(panel => {
          gsap.fromTo(panel.querySelectorAll('.tool-tile'), { opacity: 0, y: 28, rotationX: -24 }, {
            opacity: 1, y: 0, rotationX: 0, duration: .7, stagger: { each: .055, from: 'start' },
            ease: 'power3.out', clearProps: 'opacity,transform',
            scrollTrigger: { trigger: panel, start: 'top 85%', once: true }
          });
        });

        const contact = root.querySelector('#contact')!;
        gsap.timeline({ scrollTrigger: { trigger: contact, start: 'top 75%', once: true } })
          .fromTo(contact.querySelector('h2'), { clipPath: 'inset(0 0 100% 0)', y: 35 },
            { clipPath: 'inset(0 0 0% 0)', y: 0, duration: 1, ease: 'power3.out', clearProps: 'clipPath,transform' })
          .fromTo(contact.querySelectorAll('.contact-email, .contact-links a, .contact-location'), { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: .65, stagger: .08, clearProps: 'opacity,transform' }, .25)
          .fromTo(contact.querySelectorAll('.contact-form > *'), { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: .65, stagger: .1, clearProps: 'opacity,transform' }, .35);
        return () => root.classList.remove('studio-motion');
      }, root);

      this.media.add('(min-width: 1000px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
        const listeners: (() => void)[] = [];
        const listen = (element: HTMLElement, type: string, handler: EventListener) => {
          element.addEventListener(type, handler);
          listeners.push(() => element.removeEventListener(type, handler));
        };
        const portrait = root.querySelector('.hero-aside');
        gsap.to(portrait, {
          y: -65, ease: 'none',
          scrollTrigger: { trigger: root.querySelector('#top'), start: 'top top', end: 'bottom top', scrub: 1 }
        });

        root.querySelectorAll<HTMLElement>('.button, .contact-email').forEach(button => {
          const x = gsap.quickTo(button, 'x', { duration: .45, ease: 'power3.out' });
          const y = gsap.quickTo(button, 'y', { duration: .45, ease: 'power3.out' });
          listen(button, 'pointermove', ((event: PointerEvent) => {
            const bounds = button.getBoundingClientRect();
            x((event.clientX - bounds.left - bounds.width / 2) * .13);
            y((event.clientY - bounds.top - bounds.height / 2) * .2);
          }) as EventListener);
          listen(button, 'pointerleave', () => { x(0); y(0); });
        });

        root.querySelectorAll<HTMLElement>('.project-preview').forEach(card => {
          const x = gsap.quickTo(card, 'rotationY', { duration: .6, ease: 'power3.out' });
          const y = gsap.quickTo(card, 'rotationX', { duration: .6, ease: 'power3.out' });
          gsap.set(card, { transformPerspective: 1200 });
          listen(card, 'pointermove', ((event: PointerEvent) => {
            if (!card.classList.contains('is-selected') || root.querySelector('dialog[open]') || card.closest('.is-shuffling')) { x(0); y(0); return; }
            const bounds = card.getBoundingClientRect();
            x((event.clientX - bounds.left - bounds.width / 2) / bounds.width * 6);
            y(-(event.clientY - bounds.top - bounds.height / 2) / bounds.height * 6);
          }) as EventListener);
          listen(card, 'pointerleave', () => { x(0); y(0); });
          listen(card, 'click', () => { x(0); y(0); });
        });
        // Event-created tweens above use quickTo, which is recorded by this media context.
        return () => listeners.forEach(remove => remove());
      }, root);

      document.fonts?.ready.then(() => { if (!this.destroyed) { ScrollTrigger.refresh(); } });
    });
  }

  ngOnDestroy(): void { this.destroyed = true; this.media?.revert(); }
}
