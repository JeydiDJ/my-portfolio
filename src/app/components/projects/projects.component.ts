import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS } from './projects.data';
import { ProjectCardComponent } from '../project-card/project-card.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements AfterViewInit, OnDestroy {
  @ViewChildren(ProjectCardComponent) cards!: QueryList<ProjectCardComponent>;
  constructor(private changeDetector: ChangeDetectorRef, private zone: NgZone, private host: ElementRef<HTMLElement>) {}
  projects = PROJECTS;
  selected = 3;
  dragging = false;
  suppressClick = false;
  private pointer: number | null = null;
  private startX = 0;
  private startY = 0;
  private distance = 0;
  private clickTimer?: ReturnType<typeof setTimeout>;
  private shuffleTimeline?: gsap.core.Timeline;
  shuffling = false;
  private queuedSelection: number | null = null;
  private destroyed = false;
  private scrollMedia?: gsap.MatchMedia;
  private scrollScene?: ScrollTrigger;
  private scrollStep = 0;
  private scrollOrigin = 3;

  ngAfterViewInit(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { return; }
    gsap.registerPlugin(ScrollTrigger);
    this.zone.runOutsideAngular(() => {
      this.scrollMedia = gsap.matchMedia();
      this.scrollMedia.add('(min-width: 1000px) and (min-height: 680px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
        const section = this.host.nativeElement.querySelector<HTMLElement>('#projects')!;
        section.classList.add('scroll-showcase');
        this.scrollOrigin = this.selected;
        this.scrollStep = 0;
        this.scrollScene = ScrollTrigger.create({
          trigger: section, start: 'top 88px', end: () => '+=' + Math.max(1500, window.innerHeight * 2.4),
          pin: true, anticipatePin: 1, invalidateOnRefresh: true,
          onUpdate: scene => this.onDeckScroll(scene.progress)
        });
        return () => {
          section.classList.remove('scroll-showcase');
          this.scrollScene = undefined;
        };
      });
    });
  }

  onDeckScroll(progress: number): void {
    const step = Math.min(this.projects.length - 1, Math.floor(progress * this.projects.length));
    if (step === this.scrollStep || this.host.nativeElement.querySelector('dialog[open]')) { return; }
    this.scrollStep = step;
    this.zone.run(() => this.select((this.scrollOrigin + step) % this.projects.length, true));
  }

  offset(index: number): number {
    const length = this.projects.length;
    return ((index - this.selected + length + Math.floor(length / 2)) % length) - Math.floor(length / 2);
  }

  select(index: number, fromScroll = false): void {
    const next = (index + this.projects.length) % this.projects.length;
    if (!fromScroll && this.scrollScene?.isActive) {
      this.scrollOrigin = (next - this.scrollStep + this.projects.length) % this.projects.length;
    }
    if (this.shuffling) { this.queuedSelection = next; return; }
    if (next === this.selected) { return; }
    const previous = this.selected;
    const direction = this.offset(next) < 0 ? -1 : 1;
    const elements = this.cards.toArray().map(card => card.projectTrigger.nativeElement.closest('app-project-card') as HTMLElement);
    const offsets = elements.map((_, i) => this.offset(i));
    const width = elements[previous].offsetWidth;
    const adjacent = elements[(previous + 1) % elements.length];
    const step = new DOMMatrixReadOnly(getComputedStyle(adjacent).transform).m41 + width / 2;
    this.selected = next;
    this.changeDetector.detectChanges();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { return; }
    this.shuffling = true;
    const ease = 'power2.inOut';
    const pose = (offset: number): string =>
      'translate3d(' + (-width / 2 + offset * step) + 'px,' + (Math.abs(offset) * 19) + 'px,0) rotate(' + (offset * 4) + 'deg) scale(' + (1 - Math.abs(offset) * .13) + ')';

    this.zone.runOutsideAngular(() => {
    const timeline = gsap.timeline({ onComplete: () => this.zone.run(() => {
      gsap.set(elements, { clearProps: 'transform,filter,opacity,zIndex,visibility' });
      // Angular owns these inline bindings; restore them after temporary GSAP layers.
      elements.forEach((element, i) => gsap.set(element, { zIndex: 10 - Math.abs(this.offset(i)) }));
      if (this.destroyed) { return; }
      this.shuffling = false;
      const queued = this.queuedSelection;
      this.queuedSelection = null;
      if (queued !== null) { this.select(queued, true); }
      this.changeDetector.detectChanges();
    }) });
    this.shuffleTimeline = timeline;
    timeline.fromTo(this.host.nativeElement.querySelectorAll('.selected-project h3, .selected-stack'),
      { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .45, stagger: .05, ease: 'power3.out', clearProps: 'opacity,transform' }, .12);
    elements.forEach((element, i) => {
      const from = offsets[i];
      const to = this.offset(i);
      type ShuffleFrame = { transform: string; opacity: number; filter: string; zIndex: number; visibility?: string; offset?: number; easing?: string };
      const end: ShuffleFrame = { transform: pose(to), opacity: Math.abs(to) > 2 ? 0 : 1, filter: 'brightness(' + (1 - Math.abs(to) * .13) + ')', zIndex: 10 - Math.abs(to) };
      let frames: ShuffleFrame[] = [
        { transform: pose(from), opacity: Math.abs(from) > 2 ? 0 : 1, filter: 'brightness(' + (1 - Math.abs(from) * .13) + ')', zIndex: 10 - Math.abs(from), easing: ease },
        end
      ];
      if (i === previous) {
        const outside = 'translate3d(' + (-width / 2 - direction * width * .9) + 'px,8px,0) rotate(' + (-direction * 5) + 'deg) scale(.98)';
        frames = [
          { transform: pose(0), opacity: 1, filter: 'brightness(1)', zIndex: 20, visibility: 'visible', offset: 0, easing: ease },
          { transform: outside, opacity: 1, filter: 'brightness(.97)', zIndex: 20, visibility: 'visible', offset: .44 },
          { transform: outside, opacity: 1, filter: 'brightness(.97)', zIndex: 10 - Math.abs(to), visibility: 'visible', offset: .45, easing: ease },
          { ...end, visibility: 'visible', offset: 1 }
        ];
      } else if (i === next) {
        frames = [
          { ...frames[0], opacity: 1, zIndex: 10, visibility: 'visible', offset: 0, easing: ease },
          { transform: pose(0), opacity: 1, filter: 'brightness(1)', zIndex: 10, visibility: 'visible', offset: .58 },
          { ...end, visibility: 'visible', offset: 1 }
        ];
      } else if (Math.abs(from) > 2 || Math.abs(to) > 2) {
        // Recycle edge cards behind the deck instead of sweeping them across its face.
        const transform = pose(Math.abs(to) > 2 ? from : to);
        frames = [{ ...frames[0], transform, zIndex: 1, easing: ease }, { ...end, transform, zIndex: 1 }];
      }
      // Explicit timeline positions preserve the sideways exit, layer change and return.
      const styles = (frame: ShuffleFrame): gsap.TweenVars => ({
        transform: frame.transform, opacity: frame.opacity,
        filter: frame.filter, zIndex: frame.zIndex, visibility: frame.visibility ?? 'visible'
      });
      gsap.set(element, styles(frames[0]));
      frames.slice(1).forEach((frame, position) => {
        const start = Number(frames[position].offset ?? 0);
        const finish = Number(frame.offset ?? 1);
        if (finish - start < .02) {
          timeline.set(element, styles(frame), finish * .84);
        } else {
          timeline.to(element, { ...styles(frame), duration: (finish - start) * .84, ease }, start * .84);
        }
      });
    });
    });
  }

  onKeydown(event: KeyboardEvent): void {
    if ((event.target as HTMLElement).closest('dialog')) { return; }
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) { return; }
    event.preventDefault();
    if (event.key === 'ArrowLeft') { this.select(this.selected - 1); }
    if (event.key === 'ArrowRight') { this.select(this.selected + 1); }
    if (event.key === 'Home') { this.select(0); }
    if (event.key === 'End') { this.select(this.projects.length - 1); }
    this.changeDetector.detectChanges();
    this.cards.get(this.selected)?.projectTrigger.nativeElement.focus({ preventScroll: true });
  }

  startDrag(event: PointerEvent): void {
    if ((event.target as HTMLElement).closest('dialog') || event.button !== 0 || !event.isPrimary) { return; }
    clearTimeout(this.clickTimer);
    this.suppressClick = false;
    this.pointer = event.pointerId;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.distance = 0;
  }

  moveDrag(event: PointerEvent): void {
    if (event.pointerId !== this.pointer) { return; }
    const x = event.clientX - this.startX;
    const y = event.clientY - this.startY;
    if (!this.dragging && Math.abs(y) > 12 && Math.abs(y) > Math.abs(x)) { this.pointer = null; return; }
    if (!this.dragging && Math.abs(x) > 12) {
      this.dragging = true;
      this.suppressClick = true;
      (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    }
    if (this.dragging) { this.distance = x; }
  }

  endDrag(event: PointerEvent): void {
    if (event.pointerId !== this.pointer) { return; }
    if (this.dragging && event.type !== 'pointercancel' && Math.abs(this.distance) > 45) {
      this.select(this.selected + (this.distance < 0 ? 1 : -1));
    }
    const stage = event.currentTarget as HTMLElement;
    this.pointer = null;
    this.dragging = false;
    if (stage.hasPointerCapture(event.pointerId)) { stage.releasePointerCapture(event.pointerId); }
    this.clickTimer = setTimeout(() => this.suppressClick = false, 350);
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    clearTimeout(this.clickTimer);
    this.shuffleTimeline?.kill();
    this.scrollMedia?.revert();
  }
}
