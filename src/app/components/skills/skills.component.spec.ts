import { ScrollAnimateDirective } from '../../scroll-animate.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsComponent } from './skills.component';
import { MotionIconComponent } from '../motion-icon/motion-icon.component';

describe('SkillsComponent', () => {
  let component: SkillsComponent;
  let fixture: ComponentFixture<SkillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MotionIconComponent],
      declarations: [ ScrollAnimateDirective, SkillsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('keeps every tool available in its category with one selected tool per panel', () => {
    const panels = fixture.nativeElement.querySelectorAll('.skill-category');
    expect(panels.length).toBe(4);
    component.skillCategories.forEach((category, index) => {
      expect(panels[index].querySelectorAll('.tool-tile').length).toBe(category.skills.length);
      expect(panels[index].querySelectorAll('[aria-pressed="true"]').length).toBe(1);
    });
  });

  it('reveals a tool on hover or tap without resetting other categories', () => {
    const panels = fixture.nativeElement.querySelectorAll('.skill-category');
    const integrationTools = panels[2].querySelectorAll('.tool-tile');
    integrationTools[0].dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    expect(panels[2].querySelector('.tool-detail').textContent).toContain('Deploy xUML API services');
    panels[1].querySelectorAll('.tool-tile')[1].click();
    fixture.detectChanges();
    expect(panels[1].querySelector('.tool-detail h4').textContent).toBe('Python');
    expect(panels[2].querySelector('.tool-detail h4').textContent).toBe('Scheer PAS');
  });

  it('supports keyboard navigation while keeping each category one tab stop', () => {
    const panel = fixture.nativeElement.querySelector('.skill-category');
    const tools = panel.querySelectorAll('.tool-tile');
    tools[4].focus();
    tools[4].dispatchEvent(new KeyboardEvent('keydown', { key: 'End', cancelable: true }));
    fixture.detectChanges();
    expect(document.activeElement).toBe(tools[tools.length - 1]);
    expect(panel.querySelector('.tool-detail h4').textContent).toBe('Tailwind');
    tools[tools.length - 1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true }));
    fixture.detectChanges();
    expect(document.activeElement).toBe(tools[0]);
    expect(panel.querySelectorAll('[tabindex="0"]').length).toBe(1);
  });
});
