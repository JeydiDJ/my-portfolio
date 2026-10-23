import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionIconComponent } from '../motion-icon/motion-icon.component';

interface FlowNode {
  title: string; technology: string; icons: string[]; description: string;
  row: number; column: number; mobileRow: number; mobileColumn: number;
}
interface FlowEdge { from: number; to: number; label: string; bidirectional?: boolean; outside?: boolean; }
interface Flow { title: string; description: string; nodes: FlowNode[]; edges: FlowEdge[]; }
interface Route extends FlowEdge { path: string; }

@Component({
  selector: 'app-integration-flow', standalone: true,
  imports: [CommonModule, MotionIconComponent],
  templateUrl: './integration-flow.component.html',
  styleUrls: ['./integration-flow.component.scss', './integration-flow-mobile.scss']
})
export class IntegrationFlowComponent implements AfterViewInit, OnDestroy {
  @Input() variant: 'integration' | 'fullstack' = 'integration';
  @ViewChild('panel') panel!: ElementRef<HTMLElement>;
  @ViewChild('board') board!: ElementRef<HTMLElement>;
  expanded = false;
  transitioning = false;
  activeNode = 0;
  routes: Route[] = [];
  viewBox = '0 0 1000 360';
  private expansion?: gsap.core.Tween;
  private drawing?: gsap.core.Tween;
  private entrance?: gsap.core.Tween;
  private traffic?: gsap.core.Timeline;
  private resizeObserver?: ResizeObserver;
  private frame?: number;
  private boardSize = '';
  private destroyed = false;
  private motionPreference?: MediaQueryList;
  private stopMotion = () => {
    if (!this.motionPreference?.matches) { return; }
    this.zone.run(() => {
      this.expansion?.kill();
      this.finishExpansion();
      this.clearGraphMotion();
    });
  };

  readonly flows: Record<'integration' | 'fullstack', Flow> = {
    fullstack: {
      title: 'Full-stack development', description: 'Interfaces, APIs, databases & deployment',
      nodes: [
        { title: 'Interface', technology: 'React · Next.js', icons: ['reactjs-icon.svg', 'nextjs-icon.svg'], description: 'Build responsive web applications and dashboards. The interface sends requests to backend APIs and displays the results.', row: 2, column: 1, mobileRow: 1, mobileColumn: 1 },
        { title: 'Backend APIs', technology: 'Node.js · Django', icons: ['nodejs-icon.svg', 'djangoproject-icon.svg'], description: 'Handle application logic, authentication and REST endpoints, connecting the interface to the data and services it needs.', row: 2, column: 2, mobileRow: 2, mobileColumn: 1 },
        { title: 'Database', technology: 'PostgreSQL', icons: ['postgresql-icon.png'], description: 'Structure and query application data. Backend APIs read and write records and return results to the interface.', row: 1, column: 3, mobileRow: 2, mobileColumn: 2 },
        { title: 'Backend services', technology: 'Supabase', icons: ['supabase-icon.svg'], description: 'Use managed Postgres, authentication and realtime services where the project calls for them.', row: 3, column: 3, mobileRow: 3, mobileColumn: 2 },
        { title: 'Deployment', technology: 'Vercel', icons: [], description: 'Deploy web applications and deliver the interface to users. The exact framework and backend vary by project.', row: 3, column: 1, mobileRow: 3, mobileColumn: 1 }
      ],
      edges: [
        { from: 0, to: 1, label: 'HTTPS requests & responses', bidirectional: true },
        { from: 1, to: 2, label: 'Database queries & results', bidirectional: true },
        { from: 1, to: 3, label: 'Authentication & backend services', bidirectional: true },
        { from: 4, to: 0, label: 'Hosting & deployment', outside: true }
      ]
    },
    integration: {
      title: 'Enterprise integrations', description: 'Model services, connect systems & support production',
      nodes: [
        { title: 'Service models', technology: 'MagicDraw', icons: ['magicdraw-icon.png'], description: 'Develop xUML API service models and integration workflows, then deploy the services to Scheer PAS.', row: 1, column: 1, mobileRow: 1, mobileColumn: 1 },
        { title: 'API runtime', technology: 'Scheer PAS', icons: ['scheer-pas-icon.png'], description: 'Run deployed services, configure API resources and operations, and connect client systems through enterprise integrations.', row: 2, column: 2, mobileRow: 2, mobileColumn: 2 },
        { title: 'Runtime & support', technology: 'Docker · Linux', icons: ['docker-icon.png'], description: 'Manage the containers hosting PAS. Investigate logs, service health, certificates and connectivity when supporting client environments.', row: 3, column: 1, mobileRow: 3, mobileColumn: 1 },
        { title: 'Connected systems', technology: 'Client applications', icons: ['rest-api-icon.svg'], description: 'Client applications exchange requests and responses with PAS services, using the authentication and secure communication configured for the integration.', row: 2, column: 3, mobileRow: 1, mobileColumn: 2 }
      ],
      edges: [
        { from: 0, to: 1, label: 'Deploy xUML service models' },
        { from: 2, to: 1, label: 'Host runtime · inspect logs & health' },
        { from: 1, to: 3, label: 'REST API requests & responses', bidirectional: true }
      ]
    }
  };
  get flow(): Flow { return this.flows[this.variant]; }
  get selectedNode(): FlowNode { return this.flow.nodes[this.activeNode]; }
  get relationships(): string {
    return this.flow.edges.filter(edge => edge.from === this.activeNode || edge.to === this.activeNode).map(edge => edge.label).join(' · ');
  }

  constructor(private zone: NgZone, private changeDetector: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      this.motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.motionPreference.addEventListener?.('change', this.stopMotion);
      if (typeof ResizeObserver !== 'undefined') {
        this.resizeObserver = new ResizeObserver(() => this.scheduleRoutes());
        this.resizeObserver.observe(this.board.nativeElement);
      }
    });
  }

  toggle(): void {
    const panel = this.panel.nativeElement;
    const height = panel.getBoundingClientRect().height;
    const opacity = this.expanded || this.transitioning ? getComputedStyle(panel).opacity : '0';
    this.expansion?.kill();
    this.clearGraphMotion();
    this.expanded = !this.expanded;
    this.transitioning = true;
    this.changeDetector.detectChanges();
    if (this.expanded) { this.updateRoutes(); }
    if (this.motionPreference?.matches) { this.finishExpansion(); return; }
    this.zone.runOutsideAngular(() => {
      this.expansion = gsap.fromTo(panel, { height, opacity }, {
        height: this.expanded ? panel.scrollHeight : 0, opacity: this.expanded ? 1 : 0,
        duration: .45, ease: 'power3.inOut',
        onComplete: () => this.zone.run(() => this.finishExpansion())
      });
      if (this.expanded) { this.animateGraph(); }
    });
  }

  private finishExpansion(): void {
    if (this.destroyed) { return; }
    this.transitioning = false;
    gsap.set(this.panel.nativeElement, { clearProps: 'height,opacity' });
    this.changeDetector.detectChanges();
    this.zone.runOutsideAngular(() => ScrollTrigger.refresh());
  }

  selectNode(index: number): void {
    this.activeNode = index;
    this.changeDetector.detectChanges();
    this.zone.runOutsideAngular(() => this.startTraffic());
  }

  private scheduleRoutes(): void {
    if (!this.expanded || this.frame !== undefined) { return; }
    this.frame = requestAnimationFrame(() => {
      this.frame = undefined;
      if (this.destroyed || !this.expanded) { return; }
      const board = this.board.nativeElement;
      if (this.boardSize === `${board.clientWidth}:${board.clientHeight}`) { return; }
      this.clearGraphMotion();
      this.zone.run(() => this.updateRoutes());
      this.startTraffic();
    });
  }

  private updateRoutes(): void {
    const board = this.board.nativeElement;
    const bounds = board.getBoundingClientRect();
    if (!bounds.width || !bounds.height) { return; }
    this.boardSize = `${board.clientWidth}:${board.clientHeight}`;
    const nodes = Array.from(board.querySelectorAll<HTMLElement>('[data-node]')).map(element => {
      const rect = element.getBoundingClientRect();
      return { left: rect.left - bounds.left, right: rect.right - bounds.left, top: rect.top - bounds.top, bottom: rect.bottom - bounds.top, x: rect.left - bounds.left + rect.width / 2, y: rect.top - bounds.top + rect.height / 2 };
    });
    this.viewBox = `0 0 ${bounds.width} ${bounds.height}`;
    this.routes = this.flow.edges.map(edge => {
      const a = nodes[edge.from], b = nodes[edge.to];
      let path: string;
      if (edge.outside) {
        const side = Math.max(7, Math.min(a.left, b.left) - 14);
        path = `M${a.left} ${a.y} C${side} ${a.y} ${side} ${a.y} ${side} ${a.y - 20} L${side} ${b.y + 20} Q${side} ${b.y} ${b.left} ${b.y}`;
      } else if (Math.abs(a.x - b.x) < 10) {
        const down = b.y > a.y;
        const sy = down ? a.bottom : a.top, ey = down ? b.top : b.bottom;
        path = `M${a.x} ${sy} C${a.x + 20} ${sy + (ey - sy) * .35} ${b.x + 20} ${sy + (ey - sy) * .65} ${b.x} ${ey}`;
      } else {
        const direction = b.x > a.x ? 1 : -1;
        const sx = direction > 0 ? a.right : a.left, ex = direction > 0 ? b.left : b.right;
        const bend = Math.max(24, Math.abs(ex - sx) * .55);
        const lift = Math.abs(a.y - b.y) < 10 ? -16 : 0;
        path = `M${sx} ${a.y} C${sx + direction * bend} ${a.y + lift} ${ex - direction * bend} ${b.y + lift} ${ex} ${b.y}`;
      }
      return { ...edge, path };
    });
    this.changeDetector.detectChanges();
  }

  private animateGraph(): void {
    const paths = Array.from(this.board.nativeElement.querySelectorAll<SVGPathElement>('.route-active'));
    this.drawing = gsap.fromTo(paths, {
      strokeDasharray: (index: number) => paths[index].getTotalLength(),
      strokeDashoffset: (index: number) => paths[index].getTotalLength()
    }, { strokeDashoffset: 0, duration: .9, stagger: .1, ease: 'power2.inOut', clearProps: 'strokeDasharray,strokeDashoffset' });
    this.entrance = gsap.fromTo(this.board.nativeElement.querySelectorAll('[data-node]'),
      { opacity: 0 }, { opacity: 1, duration: .45, stagger: .07, clearProps: 'opacity' });
    this.startTraffic();
  }

  private startTraffic(): void {
    this.traffic?.kill();
    const root = this.board.nativeElement;
    const dots = Array.from(root.querySelectorAll<SVGCircleElement>('.route-packet'));
    gsap.set(dots, { opacity: 0 });
    if (!this.expanded || this.motionPreference?.matches) { return; }
    const paths = Array.from(root.querySelectorAll<SVGPathElement>('.route-active'));
    this.traffic = gsap.timeline();
    this.routes.forEach((route, index) => {
      if (route.from !== this.activeNode && route.to !== this.activeNode) { return; }
      const path = paths[index], dot = dots[index], length = path.getTotalLength();
      const progress = { value: 0 };
      this.traffic!.to(progress, {
        value: 1, duration: 1.5, repeat: 1, yoyo: !!route.bidirectional, ease: 'none',
        onStart: () => dot.style.opacity = '1',
        onUpdate: () => {
          const point = path.getPointAtLength(progress.value * length);
          dot.setAttribute('cx', String(point.x)); dot.setAttribute('cy', String(point.y));
        },
        onComplete: () => dot.style.opacity = '0'
      }, .25 + index * .12);
    });
  }

  private clearGraphMotion(): void {
    this.drawing?.kill(); this.entrance?.kill(); this.traffic?.kill();
    const paths = this.board.nativeElement.querySelectorAll('.route-active');
    const nodes = this.board.nativeElement.querySelectorAll('[data-node]');
    const dots = this.board.nativeElement.querySelectorAll('.route-packet');
    if (paths.length) { gsap.set(paths, { clearProps: 'strokeDasharray,strokeDashoffset' }); }
    if (nodes.length) { gsap.set(nodes, { clearProps: 'opacity' }); }
    if (dots.length) { gsap.set(dots, { opacity: 0 }); }
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.expansion?.kill(); this.drawing?.kill(); this.entrance?.kill(); this.traffic?.kill();
    this.resizeObserver?.disconnect();
    if (this.frame !== undefined) { cancelAnimationFrame(this.frame); }
    this.motionPreference?.removeEventListener?.('change', this.stopMotion);
  }
}
