import { AfterViewInit, Component, ElementRef, Input, NgZone, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-integration-flow',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './integration-flow.component.html',
  styleUrls: ['./integration-flow.component.scss']
})
export class IntegrationFlowComponent implements AfterViewInit, OnDestroy {
  @Input() variant: 'integration' | 'fullstack' = 'integration';
  readonly flows = {
    integration: {
      label: 'Enterprise API development and production support',
      title: 'From model to running service.',
      description: 'Enterprise APIs & production support.',
      stages: [
        { step: '01 / Model', title: 'MagicDraw', icons: ['magicdraw-icon.png'], description: 'Develop xUML API services and integration workflows.' },
        { step: '02 / Deploy', title: 'Scheer PAS', icons: ['scheer-pas-icon.png'], description: 'Deploy services and connect enterprise systems through APIs.' },
        { step: '03 / Operate', title: 'Docker', icons: ['docker-icon.png'], description: 'Manage PAS environments and troubleshoot client deployments.' }
      ]
    },
    fullstack: {
      label: 'Full-stack development from frontend through backend APIs to databases',
      title: 'From interface to database.',
      description: 'Full-stack web development.',
      stages: [
        { step: '01 / Frontend', title: 'React & Next.js', icons: ['reactjs-icon.svg', 'nextjs-icon.svg'], description: 'Build responsive interfaces, dashboards, and web applications.' },
        { step: '02 / Backend', title: 'Node.js & Django', icons: ['nodejs-icon.svg', 'djangoproject-icon.svg'], description: 'Develop application logic, authentication, and REST APIs.' },
        { step: '03 / Data', title: 'PostgreSQL & Supabase', icons: ['postgresql-icon.png', 'supabase-icon.svg'], description: 'Design databases, manage application data, and connect backend services.' }
      ]
    }
  };
  get flow() { return this.flows[this.variant]; }
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
