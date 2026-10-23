import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, NgZone, OnDestroy } from '@angular/core';
import { gsap } from 'gsap';

// Adapted from useAnimations SVG exports. Original files and MIT notice:
// src/assets/motion-icons/ (https://useanimations.com).
const ICON_PATHS: Record<string, string[]> = {
  code: ['M16 18 22 12 16 6', 'M8 6 2 12 8 18'],
  server: [
    'M4 14H20C21.105 14 22 14.895 22 16V20C22 21.105 21.105 22 20 22H4C2.895 22 2 21.105 2 20V16C2 14.895 2.895 14 4 14Z',
    'M6 18H6.01',
    'M4 2H20C21.105 2 22 2.895 22 4V8C22 9.105 21.105 10 20 10H4C2.895 10 2 9.105 2 8V4C2 2.895 2.895 2 4 2Z',
    'M6 6H6.01'
  ],
  database: [
    'M3 5V19C3 20.66 7 22 12 22S21 20.66 21 19V5',
    'M21 12C21 13.66 17 15 12 15S3 13.66 3 12',
    'M12 2C16.971 2 21 3.343 21 5S16.971 8 12 8 3 6.657 3 5 7.029 2 12 2Z'
  ],
  send: ['M22 2 15 22 11 13 2 9 22 2ZM22 2 11 13']
};

@Component({
  selector: 'app-motion-icon',
  standalone: true,
  imports: [CommonModule],
  template: '<svg viewBox="0 0 32 32" aria-hidden="true" focusable="false"><g transform="translate(4 4)" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path *ngFor="let path of paths" [attr.d]="path"/></g></svg>',
  styles: [':host { display: inline-flex; width: 24px; height: 24px; flex: 0 0 auto; color: inherit; vertical-align: middle; } svg { width: 100%; height: 100%; overflow: visible; }']
})
export class MotionIconComponent implements AfterViewInit, OnDestroy {
  @Input() name = 'code';
  private media?: gsap.MatchMedia;
  get paths(): string[] { return ICON_PATHS[this.name] || ICON_PATHS['code']; }

  constructor(private host: ElementRef<HTMLElement>, private zone: NgZone) {}

  ngAfterViewInit(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { return; }
    this.zone.runOutsideAngular(() => {
      const element = this.host.nativeElement;
      const paths = Array.from(element.querySelectorAll<SVGPathElement>('path'));
      const lengths = paths.map(path => path.getTotalLength());
      const trigger = element.closest('button, a, .skill-category') || element;
      this.media = gsap.matchMedia();
      this.media.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.set(paths, { strokeDasharray: (index: number) => lengths[index], strokeDashoffset: 0 });
        const animation = gsap.timeline({ paused: true })
          .fromTo(paths, { strokeDashoffset: (index: number) => lengths[index] },
            { strokeDashoffset: 0, duration: .65, stagger: .075, ease: 'power2.inOut', immediateRender: false });
        if (this.name === 'send') {
          animation.to(element.querySelector('svg'), { x: 4, y: -4, rotation: -8, duration: .2 }, .2)
            .to(element.querySelector('svg'), { x: 0, y: 0, rotation: 0, duration: .4, ease: 'power3.out' });
        }
        const play = () => { if (!animation.isActive()) { animation.restart(); } };
        trigger.addEventListener('pointerenter', play);
        trigger.addEventListener('focusin', play);
        const observer = typeof IntersectionObserver === 'undefined' ? undefined : new IntersectionObserver(entries => {
          if (entries.some(entry => entry.isIntersecting)) { play(); observer?.disconnect(); }
        }, { threshold: .5 });
        observer?.observe(element);
        return () => {
          observer?.disconnect();
          trigger.removeEventListener('pointerenter', play);
          trigger.removeEventListener('focusin', play);
        };
      }, element);
    });
  }

  ngOnDestroy(): void { this.media?.revert(); }
}
