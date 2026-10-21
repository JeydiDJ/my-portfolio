import { ScrollAnimateDirective } from '../../scroll-animate.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsComponent } from './projects.component';
import { ProjectCardComponent } from '../project-card/project-card.component';

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;

  beforeEach(async () => {
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

  afterEach(() => fixture.destroy());
});
