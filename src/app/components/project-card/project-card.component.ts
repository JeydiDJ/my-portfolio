import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss']
})
export class ProjectCardComponent implements OnChanges {
  @Input() name = '';
  @Input() logo = '';
  @Input() description = '';
  @Input() techStack: string[] = [];
  @Input() screenshots: string[] = [];
  @Input() liveLink = '';
  @Input() githubLink = '';
  expanded = false;
  currentSlide = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['screenshots']) { this.currentSlide = 0; }
  }

  toggle(): void {
    this.expanded = !this.expanded;
    if (!this.expanded) { this.currentSlide = 0; }
  }

  nextSlide(): void {
    if (this.screenshots.length) {
      this.currentSlide = (this.currentSlide + 1) % this.screenshots.length;
    }
  }

  prevSlide(): void {
    if (this.screenshots.length) {
      this.currentSlide = (this.currentSlide - 1 + this.screenshots.length) % this.screenshots.length;
    }
  }
}
