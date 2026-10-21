import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { HeroComponent } from './hero.component';

describe('HeroComponent', () => {
  let component: HeroComponent;
  let fixture: ComponentFixture<HeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeroComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders a single role with one cursor immediately after the text', () => {
    expect(fixture.nativeElement.querySelectorAll('.terminal-text').length).toBe(1);
    expect(fixture.nativeElement.querySelectorAll('.terminal-cursor').length).toBe(1);
    expect(fixture.nativeElement.querySelector('.terminal-text').nextElementSibling.classList).toContain('terminal-cursor');
  });

  it('alternates roles and stops updating after it is destroyed', fakeAsync(() => {
    spyOn(window, 'matchMedia').and.returnValue({ matches: false } as MediaQueryList);
    const hero = new HeroComponent();
    hero.ngOnInit();
    tick(5000);
    expect(hero.roleText).toBe('Systems integration');
    hero.ngOnDestroy();
    tick(10000);
    expect(hero.roleText).toBe('Systems integration');
  }));

  it('shows both roles without typing when reduced motion is preferred', () => {
    spyOn(window, 'matchMedia').and.returnValue({ matches: true } as MediaQueryList);
    const hero = new HeroComponent();
    hero.ngOnInit();
    expect(hero.roleText).toBe('Software engineer / Systems integration');
    hero.ngOnDestroy();
  });
});
