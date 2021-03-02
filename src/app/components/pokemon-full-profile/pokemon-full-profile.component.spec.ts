import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonFullProfileComponent } from './pokemon-full-profile.component';

describe('PokemonFullProfileComponent', () => {
  let component: PokemonFullProfileComponent;
  let fixture: ComponentFixture<PokemonFullProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PokemonFullProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PokemonFullProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
