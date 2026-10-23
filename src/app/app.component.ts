import { AfterViewInit, Component, HostListener, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './mobile-nav.css']
})
export class AppComponent implements AfterViewInit, OnDestroy {
  title = 'my-portfolio';
  menuOpen = false;
  @HostListener('document:keydown.escape')
  closeMenu(): void {
    if (!this.menuOpen) { return; }
    this.menuOpen = false;
    document.querySelector<HTMLButtonElement>('.menu-toggle')?.focus({ preventScroll: true });
  }
  darkMode = false;
  year = new Date().getFullYear();
  activeSection = 'top';
  showBackToTop = false;
  scrollProgress = 0;
  private scrollFrame: number | null = null;
  private topFrame: number | null = null;
  private resizeObserver?: ResizeObserver;
  private previousScrollBehavior = '';

  constructor() {
    try {
      this.darkMode = localStorage.getItem('portfolio-theme') === 'dark';
    } catch { /* Default theme works without storage. */ }
    this.applyTheme();
  }

  ngAfterViewInit(): void {
    this.scheduleScrollUpdate();
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.scheduleScrollUpdate());
      const main = document.getElementById('main');
      if (main) { this.resizeObserver.observe(main); }
    }
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  scheduleScrollUpdate(): void {
    if (this.scrollFrame !== null) { return; }
    this.scrollFrame = requestAnimationFrame(() => {
      this.scrollFrame = null;
      this.updateScrollState();
    });
  }

  updateScrollState(): void {
    const scrollTop = Math.max(0, window.scrollY);
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    this.showBackToTop = scrollTop > 400;
    this.scrollProgress = maxScroll ? Math.min(100, scrollTop / maxScroll * 100) : 0;
    const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height || 88;
    const readingLine = headerHeight + Math.min(window.innerHeight * .2, 160);
    const sections = Array.from(document.querySelectorAll<HTMLElement>('main section[id]'))
      .filter(section => ['top', 'about', 'projects', 'skills', 'workflows', 'contact'].includes(section.id));
    let current = 'top';
    sections.forEach(section => {
      if (section.getBoundingClientRect().top <= readingLine) { current = section.id; }
    });
    if (maxScroll > 0 && scrollTop >= maxScroll - 2 && sections.length) {
      current = sections[sections.length - 1].id;
    }
    this.activeSection = current;
  }

  scrollToTop(): void {
    this.cancelScrollToTop();
    this.menuOpen = false;
    this.previousScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    const startY = window.scrollY;
    const startTime = performance.now();
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 320;
    const step = (time: number) => {
      const progress = duration ? Math.min(1, (time - startTime) / duration) : 1;
      window.scrollTo(0, Math.round(startY * Math.pow(1 - progress, 3)));
      if (progress < 1) {
        this.topFrame = requestAnimationFrame(step);
      } else {
        this.topFrame = null;
        document.documentElement.style.scrollBehavior = this.previousScrollBehavior;
        window.history.replaceState(null, '', '#top');
        this.updateScrollState();
        document.querySelector<HTMLAnchorElement>('.site-nav .brand')?.focus({ preventScroll: true });
      }
    };
    this.topFrame = requestAnimationFrame(step);
  }

  @HostListener('window:wheel')
  @HostListener('window:touchstart')
  cancelScrollToTop(): void {
    if (this.topFrame === null) { return; }
    cancelAnimationFrame(this.topFrame);
    this.topFrame = null;
    document.documentElement.style.scrollBehavior = this.previousScrollBehavior;
  }

  ngOnDestroy(): void {
    if (this.scrollFrame !== null) { cancelAnimationFrame(this.scrollFrame); }
    this.cancelScrollToTop();
    this.resizeObserver?.disconnect();
  }

  toggleTheme(): void {
    this.darkMode = !this.darkMode;
    this.applyTheme();
    try {
      localStorage.setItem('portfolio-theme', this.darkMode ? 'dark' : 'light');
    } catch { /* Keep the theme for this visit. */ }
  }

  @HostListener('click', ['$event'])
  navigateToSection(event: MouseEvent): void {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) { return; }
    const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
    const id = link?.getAttribute('href')?.slice(1);
    const section = id ? document.getElementById(id) : null;
    if (!section) { return; }
    event.preventDefault();
    this.cancelScrollToTop();
    this.menuOpen = false;
    section.scrollIntoView({ block: 'start' });
    if (id === 'main') { section.focus({ preventScroll: true }); }
    window.history.replaceState(null, '', `#${id}`);
  }

  private applyTheme(): void {
    document.documentElement.setAttribute('data-theme', this.darkMode ? 'dark' : 'light');
  }
}
