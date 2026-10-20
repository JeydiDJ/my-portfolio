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
});
