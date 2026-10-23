import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { gsap } from 'gsap';
import { MotionIconComponent } from './motion-icon.component';

@Component({ standalone: true, imports: [MotionIconComponent], template: '<button><app-motion-icon name="send"></app-motion-icon>Send message</button>' })
class IconTestHost {}

describe('MotionIconComponent', () => {
  it('keeps icons visible without creating animations when reduced motion is requested', async () => {
    spyOn(window, 'matchMedia').and.returnValue({ matches: true } as MediaQueryList);
    const timeline = spyOn(gsap, 'timeline');
    await TestBed.configureTestingModule({ imports: [IconTestHost] }).compileComponents();
    const fixture = TestBed.createComponent(IconTestHost);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('path').length).toBeGreaterThan(0);
    expect(fixture.nativeElement.querySelector('svg').getAttribute('aria-hidden')).toBe('true');
    expect(timeline).not.toHaveBeenCalled();
    fixture.destroy();
  });

  it('responds to button hover and keyboard focus and removes listeners on destroy', async () => {
    spyOn(window, 'matchMedia').and.callFake(query => ({
      matches: query.includes('no-preference'), media: query,
      addListener: () => {}, removeListener: () => {},
      addEventListener: () => {}, removeEventListener: () => {}
    } as unknown as MediaQueryList));
    const create = spyOn(gsap, 'timeline').and.callThrough();
    await TestBed.configureTestingModule({ imports: [IconTestHost] }).compileComponents();
    const fixture = TestBed.createComponent(IconTestHost);
    fixture.detectChanges();
    const timeline = create.calls.mostRecent().returnValue;
    const replay = spyOn(timeline, 'restart').and.returnValue(timeline);
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    button.dispatchEvent(new Event('pointerenter'));
    button.dispatchEvent(new FocusEvent('focusin'));
    expect(replay).toHaveBeenCalledTimes(2);
    fixture.destroy();
    button.dispatchEvent(new Event('pointerenter'));
    button.dispatchEvent(new FocusEvent('focusin'));
    expect(replay).toHaveBeenCalledTimes(2);
  });
});
