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

  offset(index: number): number {
    const length = this.projects.length;
    return ((index - this.selected + length + Math.floor(length / 2)) % length) - Math.floor(length / 2);
  }

  select(index: number): void {
    const next = (index + this.projects.length) % this.projects.length;
    if (next === this.selected) { return; }
    const previous = this.selected;
    const direction = this.offset(next) < 0 ? -1 : 1;
    const elements = this.cards.toArray().map(card => card.projectTrigger.nativeElement.closest('app-project-card') as HTMLElement);
    const before = elements.map(element => {
      const style = getComputedStyle(element);
      return { transform: style.transform, filter: style.filter, opacity: style.opacity, zIndex: style.zIndex };
    });
    this.shuffleAnimations.forEach(animation => animation.cancel());
    this.shuffleAnimations = [];
    elements.forEach(element => element.style.transition = 'none');
    this.selected = next;
    this.changeDetector.detectChanges();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { return; }

    this.shuffleAnimations = elements.map((element, i) => {
      const target = getComputedStyle(element);
      const end = { transform: target.transform, filter: target.filter, opacity: target.opacity, zIndex: target.zIndex };
      let frames: Keyframe[] = [before[i], end];
      if (i === previous) {
        frames = [
          { ...before[i], offset: 0, zIndex: 20, visibility: 'visible' },
          { offset: .36, transform: `translateX(calc(-50% - ${direction} * var(--step) * 1.25)) translateY(-58px) translateZ(130px) rotateY(${-direction * 48}deg) rotateZ(${-direction * 13}deg) scale(1.02)`, zIndex: 20, filter: 'brightness(.92)', opacity: 1, visibility: 'visible' },
          { offset: .64, transform: `${end.transform} translateY(-24px) rotateY(${direction * 18}deg)`, zIndex: 7, opacity: 1, visibility: 'visible' },
          { ...end, offset: 1 }
        ];
      } else if (i === next) {
        frames = [
          { ...before[i], offset: 0, zIndex: 9, visibility: 'visible' },
          { offset: .4, transform: `translateX(calc(-50% + ${direction} * var(--step) * .25)) translateY(18px) translateZ(-70px) rotateY(${direction * 20}deg) rotateZ(${direction * 4}deg) scale(.94)`, zIndex: 10, opacity: 1, visibility: 'visible' },
          { offset: .76, transform: `translateX(-50%) translateY(-9px) translateZ(45px) rotateY(${-direction * 5}deg) scale(1.01)`, zIndex: 12, filter: 'brightness(1)', opacity: 1, visibility: 'visible' },
          { ...end, offset: 1 }
        ];
      }
      return element.animate(frames, { duration: 920, easing: 'cubic-bezier(.22,.65,.3,1)' });
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
    clearTimeout(this.clickTimer);
    this.shuffleAnimations.forEach(animation => animation.cancel());
  }
}
