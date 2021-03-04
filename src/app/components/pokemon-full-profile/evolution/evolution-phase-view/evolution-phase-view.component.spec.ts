import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvolutionPhaseViewComponent } from './evolution-phase-view.component';

describe('EvolutionPhaseViewComponent', () => {
  let component: EvolutionPhaseViewComponent;
  let fixture: ComponentFixture<EvolutionPhaseViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvolutionPhaseViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvolutionPhaseViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
