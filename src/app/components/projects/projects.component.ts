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

  offset(index: number): number {
    const length = this.projects.length;
    return ((index - this.selected + length + Math.floor(length / 2)) % length) - Math.floor(length / 2);
  }

  select(index: number): void {
    this.selected = (index + this.projects.length) % this.projects.length;
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

  ngOnDestroy(): void { clearTimeout(this.clickTimer); }
}
