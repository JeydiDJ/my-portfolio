import { ScrollAnimateDirective } from '../../scroll-animate.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsComponent } from './projects.component';
import { ProjectCardComponent } from '../project-card/project-card.component';

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;
  let motionPreference: jasmine.Spy;

  beforeEach(async () => {
    motionPreference = spyOn(window, 'matchMedia').and.returnValue({ matches: true } as MediaQueryList);
    await TestBed.configureTestingModule({
      declarations: [ ScrollAnimateDirective, ProjectsComponent, ProjectCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('wraps projects and keeps the selected project centered', () => {
    component.select(component.projects.length);
    expect(component.selected).toBe(0);
    expect(component.offset(0)).toBe(0);
    expect(component.offset(component.projects.length - 1)).toBe(-1);
    component.select(-1);
    expect(component.selected).toBe(component.projects.length - 1);
  });

  it('selects a side card before opening its details', () => {
    const previews = fixture.nativeElement.querySelectorAll('.project-preview');
    previews[4].click();
    fixture.detectChanges();
    expect(component.selected).toBe(4);
    expect(fixture.nativeElement.querySelectorAll('dialog[open]').length).toBe(0);
    previews[4].click();
    expect(fixture.nativeElement.querySelectorAll('dialog[open]').length).toBe(1);
  });

  it('changes projects by keyboard without intercepting gallery navigation', () => {
    const stage = fixture.nativeElement.querySelector('.projects-carousel');
    stage.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(component.selected).toBe(4);
    fixture.detectChanges();
    expect(document.activeElement).toBe(fixture.nativeElement.querySelectorAll('.project-preview')[4]);
    fixture.nativeElement.querySelectorAll('.project-preview')[4].click();
    const gallery = fixture.nativeElement.querySelectorAll('.project-gallery')[4];
    spyOn(gallery, 'scrollTo');
    gallery.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(component.selected).toBe(4);
  });

  it('swipes once without accidentally opening project details', () => {
    const stage = fixture.nativeElement.querySelector('.projects-carousel');
    spyOn(stage, 'setPointerCapture');
    spyOn(stage, 'hasPointerCapture').and.returnValue(false);
    stage.dispatchEvent(new PointerEvent('pointerdown', { pointerId: 1, isPrimary: true, clientX: 300, clientY: 100 }));
    stage.dispatchEvent(new PointerEvent('pointermove', { pointerId: 1, isPrimary: true, clientX: 180, clientY: 105 }));
    stage.dispatchEvent(new PointerEvent('pointerup', { pointerId: 1, isPrimary: true, clientX: 180, clientY: 105 }));
    fixture.detectChanges();
    expect(component.selected).toBe(4);
    fixture.nativeElement.querySelectorAll('.project-preview')[4].click();
    expect(fixture.nativeElement.querySelectorAll('dialog[open]').length).toBe(0);
  });

  it('queues rapid navigation so the active sideways shuffle is not interrupted', async () => {
    motionPreference.and.returnValue({ matches: false } as MediaQueryList);
    const animations: { cancel: jasmine.Spy; finished: Promise<void> }[] = [];
    const finish: (() => void)[] = [];
    spyOn(HTMLElement.prototype, 'animate').and.callFake(() => {
      const animation = { cancel: jasmine.createSpy('cancel'), finished: new Promise<void>(resolve => finish.push(resolve)) };
      animations.push(animation);
      return animation as unknown as Animation;
    });
    component.select(4);
    const firstShuffle = animations.slice();
    component.select(5);
    expect(component.selected).toBe(4);
    expect(firstShuffle.length).toBeGreaterThan(0);
    firstShuffle.forEach(animation => expect(animation.cancel).not.toHaveBeenCalled());
    finish.slice().forEach(resolve => resolve());
    await Promise.all(firstShuffle.map(animation => animation.finished));
    await Promise.resolve();
    expect(component.selected).toBe(5);
    fixture.destroy();
    animations.slice(firstShuffle.length).forEach(animation => expect(animation.cancel).toHaveBeenCalled());
  });

  it('changes projects without shuffle motion when reduced motion is requested', () => {
    motionPreference.and.returnValue({ matches: true } as MediaQueryList);
    const animate = spyOn(HTMLElement.prototype, 'animate');
    component.select(4);
    expect(component.selected).toBe(4);
    expect(animate).not.toHaveBeenCalled();
  });

  afterEach(() => fixture.destroy());
});
