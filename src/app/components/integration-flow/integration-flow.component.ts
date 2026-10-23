import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-integration-flow',
  standalone: true,
  templateUrl: './integration-flow.component.html',
  styleUrls: ['./integration-flow.component.scss']
})
export class IntegrationFlowComponent implements AfterViewInit, OnDestroy {
  private media?: gsap.MatchMedia;
  constructor(private host: ElementRef<HTMLElement>, private zone: NgZone) {}

  ngAfterViewInit(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { return; }
    this.zone.runOutsideAngular(() => {
      const root = this.host.nativeElement;
      this.media = gsap.matchMedia();
      this.media.add('(prefers-reduced-motion: no-preference)', () => {
        const paths = Array.from(root.querySelectorAll<SVGPathElement>('.flow-route'));
        gsap.set(paths, { strokeDasharray: (index: number) => paths[index].getTotalLength() });
        gsap.timeline({ scrollTrigger: { trigger: root, start: 'top 82%', once: true } })
          .fromTo(root.querySelectorAll('.flow-stage'), { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: .75, stagger: .16, ease: 'power3.out', clearProps: 'opacity,transform' })
          .fromTo(paths, { strokeDashoffset: (index: number) => paths[index].getTotalLength() },
            { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut' }, .2)
          .fromTo(root.querySelectorAll('.flow-logo img'), { scale: .82 },
            { scale: 1, duration: .65, stagger: .16, ease: 'back.out(1.3)', clearProps: 'transform' }, .2)
          .fromTo(root.querySelectorAll('.flow-packet-horizontal'), { attr: { cx: 0 }, opacity: 0 },
            { attr: { cx: 1000 }, opacity: 1, duration: 1.8, stagger: .3, repeat: 1, ease: 'power1.inOut' }, .7)
          .fromTo(root.querySelectorAll('.flow-packet-vertical'), { attr: { cy: 0 }, opacity: 0 },
            { attr: { cy: 600 }, opacity: 1, duration: 1.8, stagger: .3, repeat: 1, ease: 'power1.inOut' }, .7)
          .to(root.querySelectorAll('.flow-packet'), { opacity: 0, duration: .3 });
      }, root);
    });
  }

  ngOnDestroy(): void { this.media?.revert(); }
}
