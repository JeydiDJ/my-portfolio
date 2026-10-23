import { ComponentFixture, TestBed } from '@angular/core/testing';
import { gsap } from 'gsap';
import { IntegrationFlowComponent } from './integration-flow.component';

describe('IntegrationFlowComponent', () => {
  let fixture: ComponentFixture<IntegrationFlowComponent>;
  let component: IntegrationFlowComponent;
  let motionPreference: jasmine.Spy;

  beforeEach(async () => {
    motionPreference = spyOn(window, 'matchMedia').and.returnValue({ matches: true } as MediaQueryList);
    await TestBed.configureTestingModule({ imports: [IntegrationFlowComponent] }).compileComponents();
    fixture = TestBed.createComponent(IntegrationFlowComponent);
    component = fixture.componentInstance;
    component.variant = 'fullstack';
    fixture.nativeElement.style.width = '900px';
    fixture.detectChanges();
  });
  afterEach(() => fixture.destroy());

  it('starts compact and excludes the collapsed map from keyboard navigation', () => {
    expect(fixture.nativeElement.querySelector('.workflow-toggle').getAttribute('aria-expanded')).toBe('false');
    expect(fixture.nativeElement.querySelector('.workflow-panel').hidden).toBeTrue();
    expect(fixture.nativeElement.querySelector('.workflow-panel').hasAttribute('inert')).toBeTrue();
  });

  it('expands without motion and reveals the selected node relationships', () => {
    const animate = spyOn(gsap, 'fromTo').and.callThrough();
    fixture.nativeElement.querySelector('.workflow-toggle').click();
    expect(fixture.nativeElement.querySelector('.workflow-panel').hidden).toBeFalse();
    expect(fixture.nativeElement.querySelector('.workflow-toggle').getAttribute('aria-expanded')).toBe('true');
    fixture.nativeElement.querySelectorAll('.flow-node')[1].click();
    expect(fixture.nativeElement.querySelector('.flow-inspector').textContent).toContain('Database queries & results');
    expect(component.routes.length).toBe(4);
    expect(component.routes.every(route => route.path.includes('C'))).toBeTrue();
    expect(animate).not.toHaveBeenCalled();
    fixture.nativeElement.querySelector('.workflow-toggle').click();
    expect(fixture.nativeElement.querySelector('.workflow-panel').hidden).toBeTrue();
  });

  it('handles closing during expansion without leaving content visible or interactive', () => {
    Object.defineProperty(motionPreference.calls.mostRecent().returnValue, 'matches', { value: false });
    motionPreference.and.returnValue({ matches: false } as MediaQueryList);
    const original = gsap.fromTo.bind(gsap);
    const transitions: gsap.core.Tween[] = [];
    spyOn(gsap, 'fromTo').and.callFake((target, from, to) => {
      const tween = original(target, from as gsap.TweenVars, to).pause();
      if (target === component.panel.nativeElement) { transitions.push(tween); }
      return tween;
    });
    component.toggle();
    const kill = spyOn(transitions[0], 'kill').and.callThrough();
    component.toggle();
    expect(kill).toHaveBeenCalled();
    transitions[1].progress(1);
    expect(component.transitioning).toBeFalse();
    expect(component.panel.nativeElement.hidden).toBeTrue();
    expect(component.panel.nativeElement.hasAttribute('inert')).toBeTrue();
  });
});
