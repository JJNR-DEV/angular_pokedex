import { Component, Input, OnInit } from '@angular/core';

import { PokemonItemService } from '../../../services/pokemon-item.service';

@Component({
  selector: 'app-evolution',
  templateUrl: './evolution.component.html',
  styleUrls: ['./evolution.component.sass']
})
export class EvolutionComponent implements OnInit {
  @Input() pokemonID;
  @Input() pokemonColor;

  evolutionPhase: object[] = [];

  constructor(private http: PokemonItemService) { }

  ngOnInit(): void { }
  
  ngOnChanges() {
    if(this.pokemonID) {
      this.http.pokemonCharacteristics(this.pokemonID).subscribe((data: {
        evolution_chain: {
          url: string
        }
      }) => {
        this.http.pokemonEvolution(data.evolution_chain.url).subscribe((data: any) => {
          let phaseBefore = data.chain.species;
          let nextEvolution = data.chain.evolves_to.find(pokemon => pokemon.evolves_to);

          while(nextEvolution !== undefined) {
            this.addPhase(phaseBefore, nextEvolution);
            phaseBefore = nextEvolution.species;
            nextEvolution = nextEvolution.evolves_to[0];
          }

        })
      });
    }
  }

  allPhases(phase) {
    this.evolutionPhase = [...this.evolutionPhase, phase]
  }

  addPhase(phaseBefore, nextPhase) {
    const phaseAfter = {
      ...nextPhase.species,
      min_level: nextPhase.evolution_details[0].min_level
    }
    this.allPhases([ phaseBefore, phaseAfter ]);
  }

}
