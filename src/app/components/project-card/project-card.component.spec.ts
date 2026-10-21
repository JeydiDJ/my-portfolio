import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectCardComponent } from './project-card.component';

describe('ProjectCardComponent', () => {
  let component: ProjectCardComponent;
  let fixture: ComponentFixture<ProjectCardComponent>;
  let gallery: HTMLDivElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ declarations: [ProjectCardComponent] }).compileComponents();
    fixture = TestBed.createComponent(ProjectCardComponent);
    component = fixture.componentInstance;
    component.name = 'Sample project';
    component.screenshots = ['assets/jd.jpg', 'assets/jd.jpg', 'assets/jd.jpg'];
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.project-preview').click();
    gallery = fixture.nativeElement.querySelector('.project-gallery');
    Object.defineProperty(gallery, 'clientWidth', { value: 400, configurable: true });
    Object.defineProperty(gallery, 'scrollLeft', { value: 0, writable: true, configurable: true });
    spyOn(gallery, 'scrollTo');
  });

  afterEach(() => fixture.destroy());

  it('opens project details with all screenshots and locks background scrolling', () => {
    expect(fixture.nativeElement.querySelector('dialog').open).toBeTrue();
    expect(document.body.style.overflow).toBe('hidden');
    expect(gallery.querySelectorAll('.project-slide').length).toBe(3);
    expect(fixture.nativeElement.textContent).not.toContain('Explore project');
    expect(fixture.nativeElement.querySelector('.gallery-navigation')).toBeNull();
    expect(fixture.nativeElement.querySelector('.gallery-pagination')).toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('Drag to explore');
  });

  it('closes with the close button and restores focus and background scrolling', () => {
    fixture.nativeElement.querySelector('.dialog-close').click();
    expect(fixture.nativeElement.querySelector('dialog').open).toBeFalse();
    expect(document.body.style.overflow).not.toBe('hidden');
    expect(document.activeElement).toBe(fixture.nativeElement.querySelector('.project-preview'));
  });

  it('dismisses on Escape and cleans up scrolling when destroyed while open', () => {
    const dialog = fixture.nativeElement.querySelector('dialog');
    dialog.dispatchEvent(new Event('cancel', { cancelable: true }));
    expect(dialog.open).toBeFalse();
    component.openProject();
    fixture.destroy();
    expect(document.body.style.overflow).not.toBe('hidden');
  });

  it('supports keyboard navigation and wraps at the final screenshot', () => {
    const event = new KeyboardEvent('keydown', { key: 'End', cancelable: true });
    gallery.dispatchEvent(event);
    expect(component.currentSlide).toBe(2);
    expect(event.defaultPrevented).toBeTrue();
    component.nextSlide();
    expect(component.currentSlide).toBe(0);
    expect((gallery.scrollTo as jasmine.Spy).calls.mostRecent().args[0].left).toBe(0);
    component.prevSlide();
    expect(component.currentSlide).toBe(2);
  });

  it('announces the selected screenshot after native swipe or trackpad scrolling', () => {
    gallery.scrollLeft = 790;
    gallery.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();
    expect(component.currentSlide).toBe(2);
    expect(fixture.nativeElement.querySelector('[aria-live]').textContent).toContain('screenshot 3 of 3');
  });

  it('drags with the mouse and snaps to the adjacent screenshot on release', () => {
    spyOn(gallery, 'setPointerCapture');
    spyOn(gallery, 'hasPointerCapture').and.returnValue(true);
    spyOn(gallery, 'releasePointerCapture');
    gallery.dispatchEvent(new PointerEvent('pointerdown', { pointerType: 'mouse', pointerId: 1, clientX: 350, button: 0 }));
    gallery.dispatchEvent(new PointerEvent('pointermove', { pointerType: 'mouse', pointerId: 1, clientX: 130 }));
    expect(gallery.scrollLeft).toBe(220);
    gallery.dispatchEvent(new PointerEvent('pointerup', { pointerType: 'mouse', pointerId: 1, clientX: 130 }));
    expect(component.dragging).toBeFalse();
    expect(component.currentSlide).toBe(1);
    expect((gallery.scrollTo as jasmine.Spy).calls.mostRecent().args[0].left).toBe(400);
    expect(gallery.releasePointerCapture).toHaveBeenCalledWith(1);
  });

  it('leaves touch gestures to native scrolling without blocking vertical page movement', () => {
    const event = new PointerEvent('pointerdown', { pointerType: 'touch', pointerId: 2, cancelable: true });
    gallery.dispatchEvent(event);
    expect(component.dragging).toBeFalse();
    expect(event.defaultPrevented).toBeFalse();
  });
});
