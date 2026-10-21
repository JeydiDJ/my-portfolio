import { Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss', './project-dialog.scss', './project-carousel.scss']
})
export class ProjectCardComponent implements OnDestroy {
  @Input() name = '';
  @Input() logo = '';
  @Input() description = '';
  @Input() techStack: string[] = [];
  @Input() screenshots: string[] = [];
  @Input() liveLink = '';
  @Input() githubLink = '';
  @Input() carousel = false;
  @Input() active = true;
  @Input() previewTabIndex = 0;
  @Input() suppressClick = false;
  @Output() selectProject = new EventEmitter<void>();

  activateProject(): void {
    if (this.suppressClick) { return; }
    if (this.carousel && !this.active) { this.selectProject.emit(); return; }
    this.openProject();
  }
  @ViewChild('gallery') gallery?: ElementRef<HTMLDivElement>;
  @ViewChild('projectDialog') projectDialog!: ElementRef<HTMLDialogElement>;
  @ViewChild('projectTrigger') projectTrigger!: ElementRef<HTMLButtonElement>;
  private previousOverflow: string | null = null;
  private dialogAnimation?: Animation;
  private detailAnimations: Animation[] = [];
  private closing = false;

  private cardTransform(dialog: HTMLDialogElement): string {
    const card = this.projectTrigger.nativeElement.querySelector('.project-cover')!.getBoundingClientRect();
    const modal = dialog.getBoundingClientRect();
    return `translate(${card.left - modal.left}px, ${card.top - modal.top}px) scale(${card.width / modal.width}, ${card.height / modal.height})`;
  }

  openProject(): void {
    if (this.projectDialog.nativeElement.open) { return; }
    this.previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    this.projectDialog.nativeElement.showModal();
    const dialog = this.projectDialog.nativeElement;
    dialog.scrollTop = 0;
    this.currentSlide = 0;
    this.gallery?.nativeElement.scrollTo({ left: 0, behavior: 'auto' });
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { return; }
    this.dialogAnimation = dialog.animate([
      { transform: this.cardTransform(dialog), opacity: .85, borderRadius: '8px' },
      { transform: 'translate(0, 0) scale(1, 1)', opacity: 1, borderRadius: '12px' }
    ], { duration: 580, easing: 'cubic-bezier(.16,1,.3,1)' });
    this.detailAnimations = Array.from(dialog.querySelectorAll<HTMLElement>('.dialog-header, .project-body')).map(element =>
      element.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }],
        { duration: 320, delay: 160, fill: 'backwards', easing: 'ease-out' }));
  }

  closeProject(): void {
    const dialog = this.projectDialog.nativeElement;
    if (!dialog.open || this.closing) { return; }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { this.finishClose(); return; }
    const currentTransform = getComputedStyle(dialog).transform;
    this.dialogAnimation?.cancel();
    this.detailAnimations.forEach(animation => animation.cancel());
    this.closing = true;
    this.dialogAnimation = dialog.animate([
      { transform: currentTransform, opacity: 1 },
      { transform: this.cardTransform(dialog), opacity: 0, borderRadius: '8px' }
    ], { duration: 360, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' });
    this.dialogAnimation.finished.then(() => this.finishClose()).catch(() => {});
  }

  private finishClose(): void {
    this.projectDialog.nativeElement.close();
    this.onDialogClose();
    this.projectTrigger.nativeElement.focus({ preventScroll: true });
  }

  onDialogClose(): void {
    this.dialogAnimation?.cancel();
    this.detailAnimations.forEach(animation => animation.cancel());
    this.closing = false;
    if (this.previousOverflow === null) { return; }
    document.body.style.overflow = this.previousOverflow;
    this.previousOverflow = null;
  }

  onBackdropClick(event: MouseEvent): void {
    const dialog = this.projectDialog.nativeElement;
    if (event.target !== dialog) { return; }
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
      this.closeProject();
    }
  }

  ngOnDestroy(): void {
    this.dialogAnimation?.cancel();
    this.detailAnimations.forEach(animation => animation.cancel());
    if (this.projectDialog?.nativeElement.open) { this.projectDialog.nativeElement.close(); }
    this.onDialogClose();
  }

  currentSlide = 0;
  dragging = false;
  private pointerId: number | null = null;
  private startX = 0;
  private startScroll = 0;

  goToSlide(index: number): void {
    if (!this.screenshots.length) { return; }
    this.currentSlide = (index + this.screenshots.length) % this.screenshots.length;
    const gallery = this.gallery?.nativeElement;
    gallery?.scrollTo({
      left: this.currentSlide * gallery.clientWidth,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    });
  }

  nextSlide(): void { this.goToSlide(this.currentSlide + 1); }
  prevSlide(): void { this.goToSlide(this.currentSlide - 1); }

  onScroll(): void {
    const gallery = this.gallery?.nativeElement;
    if (!gallery?.clientWidth) { return; }
    this.currentSlide = Math.min(this.screenshots.length - 1, Math.max(0,
      Math.round(gallery.scrollLeft / gallery.clientWidth)));
  }

  startDrag(event: PointerEvent): void {
    if (event.pointerType !== 'mouse' || event.button !== 0 || this.screenshots.length < 2) { return; }
    const gallery = this.gallery!.nativeElement;
    event.preventDefault();
    gallery.focus({ preventScroll: true });
    this.pointerId = event.pointerId;
    this.startX = event.clientX;
    this.startScroll = gallery.scrollLeft;
    this.dragging = true;
    gallery.setPointerCapture(event.pointerId);
  }

  moveDrag(event: PointerEvent): void {
    if (this.pointerId !== event.pointerId || !this.dragging) { return; }
    this.gallery!.nativeElement.scrollLeft = this.startScroll - (event.clientX - this.startX);
  }

  endDrag(event: PointerEvent): void {
    if (this.pointerId !== event.pointerId) { return; }
    const gallery = this.gallery!.nativeElement;
    const distance = gallery.scrollLeft - this.startScroll;
    const startSlide = Math.round(this.startScroll / gallery.clientWidth);
    const nextSlide = Math.abs(distance) > Math.min(60, gallery.clientWidth * .15)
      ? startSlide + Math.sign(distance)
      : startSlide;
    this.dragging = false;
    this.pointerId = null;
    if (gallery.hasPointerCapture(event.pointerId)) { gallery.releasePointerCapture(event.pointerId); }
    this.goToSlide(Math.max(0, Math.min(this.screenshots.length - 1, nextSlide)));
  }

  onKeydown(event: KeyboardEvent): void {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) { return; }
    event.preventDefault();
    if (event.key === 'ArrowLeft') { this.prevSlide(); }
    if (event.key === 'ArrowRight') { this.nextSlide(); }
    if (event.key === 'Home') { this.goToSlide(0); }
    if (event.key === 'End') { this.goToSlide(this.screenshots.length - 1); }
  }
}
