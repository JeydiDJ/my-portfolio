import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'setItem');
    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [AppComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  afterEach(() => document.documentElement.removeAttribute('data-theme'));

  it('renders the portfolio navigation', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('nav').getAttribute('aria-label')).toBe('Main navigation');
    expect(fixture.nativeElement.querySelectorAll('.nav-links a').length).toBe(5);
  });

  it('navigates to the start of a pinned project sequence', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const spacer = document.createElement('div');
    spacer.className = 'pin-spacer';
    const section = document.createElement('section');
    section.id = 'projects';
    spacer.appendChild(section);
    fixture.nativeElement.querySelector('main').appendChild(spacer);
    spyOn(spacer, 'getBoundingClientRect').and.returnValue({ top: 450 } as DOMRect);
    const scroll = spyOn(window, 'scrollTo');
    const headerHeight = document.querySelector('.site-header')!.getBoundingClientRect().height || 88;
    const expectedTop = Math.max(0, window.scrollY + 450 - headerHeight);
    fixture.nativeElement.querySelector('a[href="#projects"]').click();
    expect(scroll).toHaveBeenCalled();
    expect((scroll.calls.mostRecent().args[0] as unknown as ScrollToOptions).top).toBe(expectedTop);
  });

  it('toggles the mobile menu and its accessible state', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('.menu-toggle') as HTMLButtonElement;
    button.click();
    fixture.detectChanges();
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(fixture.nativeElement.querySelector('.nav-links').classList.contains('is-open')).toBeTrue();
    button.click();
    fixture.detectChanges();
    expect(button.getAttribute('aria-expanded')).toBe('false');
  });

  it('closes the mobile navigation from its backdrop or Escape', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('.menu-toggle') as HTMLButtonElement;
    button.click();
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.menu-backdrop').click();
    fixture.detectChanges();
    expect(fixture.componentInstance.menuOpen).toBeFalse();
    button.click();
    fixture.detectChanges();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(button.getAttribute('aria-expanded')).toBe('false');
  });

  it('switches and remembers the color theme', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.theme-toggle').click();
    fixture.detectChanges();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.setItem).toHaveBeenCalledWith('portfolio-theme', 'dark');
    expect(fixture.nativeElement.querySelector('.theme-toggle').getAttribute('aria-label')).toBe('Switch to light theme');
  });

  it('scrolls internal links to the intended section and closes the menu', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const main = fixture.nativeElement.querySelector('main') as HTMLElement;
    const scroll = spyOn(main, 'scrollIntoView');
    spyOn(window.history, 'replaceState');
    fixture.componentInstance.menuOpen = true;
    fixture.nativeElement.querySelector('.skip-link').click();
    expect(scroll).toHaveBeenCalledWith({ block: 'start' });
    expect(fixture.componentInstance.menuOpen).toBeFalse();
    expect(window.history.replaceState).toHaveBeenCalledWith(null, '', '#main');
  });

  it('highlights the section at the reading line in page order', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const main = fixture.nativeElement.querySelector('main') as HTMLElement;
    ['top', 'projects', 'about', 'skills', 'contact'].forEach((id, i) => {
      const section = document.createElement('section');
      section.id = id;
      main.appendChild(section);
      spyOn(section, 'getBoundingClientRect').and.returnValue({ top: [-1500, -800, -100, 800, 1600][i] } as DOMRect);
    });
    spyOnProperty(window, 'scrollY').and.returnValue(1500);
    spyOnProperty(window, 'innerHeight').and.returnValue(800);
    spyOnProperty(document.documentElement, 'scrollHeight').and.returnValue(5000);
    fixture.componentInstance.updateScrollState();
    fixture.detectChanges();
    const active = fixture.nativeElement.querySelectorAll('.nav-links [aria-current="location"]');
    expect(active.length).toBe(1);
    expect(active[0].textContent).toBe('About');
    expect(fixture.componentInstance.showBackToTop).toBeTrue();
    expect(fixture.componentInstance.scrollProgress).toBeCloseTo(35.71, 1);
  });

  it('marks the final section at the page bottom and completes the progress ring', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const section = document.createElement('section');
    section.id = 'contact';
    fixture.nativeElement.querySelector('main').appendChild(section);
    spyOn(section, 'getBoundingClientRect').and.returnValue({ top: 600 } as DOMRect);
    spyOnProperty(window, 'scrollY').and.returnValue(1200);
    spyOnProperty(window, 'innerHeight').and.returnValue(800);
    spyOnProperty(document.documentElement, 'scrollHeight').and.returnValue(2000);
    fixture.componentInstance.updateScrollState();
    expect(fixture.componentInstance.activeSection).toBe('contact');
    expect(fixture.componentInstance.scrollProgress).toBe(100);
  });

  it('hides the top button on a short page without dividing by zero', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    spyOnProperty(window, 'scrollY').and.returnValue(0);
    spyOnProperty(window, 'innerHeight').and.returnValue(800);
    spyOnProperty(document.documentElement, 'scrollHeight').and.returnValue(800);
    fixture.componentInstance.updateScrollState();
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('.back-to-top');
    expect(button.getAttribute('tabindex')).toBe('-1');
    expect(button.getAttribute('aria-hidden')).toBe('true');
    expect(fixture.componentInstance.scrollProgress).toBe(0);
  });

  it('returns to the top without animation for reduced motion and restores scroll behavior', () => {
    let callback: FrameRequestCallback = () => {};
    let scrollY = 900;
    spyOn(window, 'requestAnimationFrame').and.callFake(frame => { callback = frame; return 1; });
    spyOn(window, 'cancelAnimationFrame');
    spyOn(window, 'matchMedia').and.returnValue({ matches: true } as MediaQueryList);
    spyOnProperty(window, 'scrollY').and.callFake(() => scrollY);
    spyOn(window, 'scrollTo').and.callFake(() => { scrollY = 0; });
    spyOn(window.history, 'replaceState');
    const previousBehavior = document.documentElement.style.scrollBehavior;
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    fixture.componentInstance.scrollToTop();
    callback(performance.now() + 16);
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    expect(fixture.componentInstance.activeSection).toBe('top');
    expect(document.documentElement.style.scrollBehavior).toBe(previousBehavior);
    expect(window.history.replaceState).toHaveBeenCalledWith(null, '', '#top');
  });
});
