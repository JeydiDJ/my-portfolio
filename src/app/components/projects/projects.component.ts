import { ChangeDetectorRef, Component, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { PROJECTS } from './projects.data';
import { ProjectCardComponent } from '../project-card/project-card.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnDestroy {
  @ViewChildren(ProjectCardComponent) cards!: QueryList<ProjectCardComponent>;
  constructor(private changeDetector: ChangeDetectorRef) {}
  projects = PROJECTS;
  selected = 3;
  dragging = false;
  suppressClick = false;
  private pointer: number | null = null;
  private startX = 0;
  private startY = 0;
  private distance = 0;
  private clickTimer?: ReturnType<typeof setTimeout>;
  private shuffleAnimations: Animation[] = [];
  shuffling = false;
  private queuedSelection: number | null = null;
  private destroyed = false;

  offset(index: number): number {
    const length = this.projects.length;
    return ((index - this.selected + length + Math.floor(length / 2)) % length) - Math.floor(length / 2);
  }

  select(index: number): void {
    const next = (index + this.projects.length) % this.projects.length;
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
    const ease = 'cubic-bezier(.4,0,.2,1)';
    const pose = (offset: number): string =>
      'translate3d(' + (-width / 2 + offset * step) + 'px,' + (Math.abs(offset) * 19) + 'px,0) rotate(' + (offset * 4) + 'deg) scale(' + (1 - Math.abs(offset) * .13) + ')';

    this.shuffleAnimations = elements.map((element, i) => {
      const from = offsets[i];
      const to = this.offset(i);
      const end: Keyframe = { transform: pose(to), opacity: Math.abs(to) > 2 ? 0 : 1, filter: 'brightness(' + (1 - Math.abs(to) * .13) + ')', zIndex: 10 - Math.abs(to) };
      let frames: Keyframe[] = [
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
      return element.animate(frames, { duration: 840, easing: 'linear' });
    });
    Promise.allSettled(this.shuffleAnimations.map(animation => animation.finished)).then(() => {
      if (this.destroyed) { return; }
      this.shuffleAnimations = [];
      this.shuffling = false;
      const queued = this.queuedSelection;
      this.queuedSelection = null;
      if (queued !== null) { this.select(queued); }
      this.changeDetector.detectChanges();
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
    this.shuffleAnimations.forEach(animation => animation.cancel());
  }
}
