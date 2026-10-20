import { ElementRef, Renderer2 } from '@angular/core';
import { ScrollAnimateDirective } from './scroll-animate.directive';

describe('ScrollAnimateDirective', () => {
  it('should create an instance', () => {
    const element = new ElementRef(document.createElement('div'));
    const renderer = jasmine.createSpyObj<Renderer2>('Renderer2', ['addClass']);
    const directive = new ScrollAnimateDirective(element, renderer);
    expect(directive).toBeTruthy();
  });
});
