import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss']
})
export class ProjectCardComponent {
  @Input() name = '';
  @Input() logo = '';
  @Input() description = '';
  @Input() techStack: string[] = [];
  @Input() screenshots: string[] = [];
  @Input() liveLink = '';
  @Input() githubLink = '';
  @ViewChild('gallery') gallery?: ElementRef<HTMLDivElement>;

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
