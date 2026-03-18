// project-card.component.ts
import { Component, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss']
})
export class ProjectCardComponent implements AfterViewInit {
  @Input() name!: string;
  @Input() logo!: string;
  @Input() description!: string;
  @Input() techStack: string[] = [];
  @Input() screenshots: string[] = [];
  @Input() liveLink!: string;
  @Input() githubLink!: string;

  techIconMap: { [key: string]: string } = {
  'Vue.js': 'assets/tech-icons/vuejs-icon.svg',
  'Angular': 'assets/tech-icons/angular-icon.svg',
  'Firebase': 'assets/tech-icons/firebase-icon.svg',
  'Mapbox': 'assets/tech-icons/mapbox-icon.svg',
  'HTML': 'assets/tech-icons/w3_html5-icon.svg',
  'CSS': 'assets/tech-icons/w3_css-icon~old.svg',
  'Javascript': 'assets/tech-icons/javascript-icon.svg',
  'MongoDB': 'assets/tech-icons/mongodb-icon.svg',
  'Tailwind': 'assets/tech-icons/tailwindcss-icon.svg',
  'TypeScript': 'assets/tech-icons/typescriptlang-icon.svg',
  'Wix': 'assets/tech-icons/wix-icon.svg',
};

  expanded = false;
  currentSlide = 0;

  @ViewChild('expandableContent') expandableContent!: ElementRef<HTMLDivElement>;
  maxHeight = '0px';

  ngAfterViewInit() {
    this.maxHeight = this.expanded ? `${this.expandableContent.nativeElement.scrollHeight}px` : '0px';
  }

  toggle() {
    this.expanded = !this.expanded;
    this.maxHeight = this.expanded
      ? `${this.expandableContent.nativeElement.scrollHeight}px`
      : '0px';
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.screenshots.length;
  }

  prevSlide() {
    this.currentSlide =
      (this.currentSlide - 1 + this.screenshots.length) % this.screenshots.length;
  }
}