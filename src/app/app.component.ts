import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-portfolio';
  menuOpen = false;
  darkMode = false;
  year = new Date().getFullYear();

  constructor() {
    try {
      this.darkMode = localStorage.getItem('portfolio-theme') === 'dark';
    } catch { /* Default theme works without storage. */ }
    this.applyTheme();
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
    this.menuOpen = false;
    section.scrollIntoView({ block: 'start' });
    if (id === 'main') { section.focus({ preventScroll: true }); }
    window.history.replaceState(null, '', `#${id}`);
  }

  private applyTheme(): void {
    document.documentElement.setAttribute('data-theme', this.darkMode ? 'dark' : 'light');
  }
}
