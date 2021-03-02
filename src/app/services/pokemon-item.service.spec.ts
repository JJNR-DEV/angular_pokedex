import { TestBed } from '@angular/core/testing';

import { PokemonItemService } from './pokemon-item.service';

describe('PokemonItemService', () => {
  let service: PokemonItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PokemonItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
