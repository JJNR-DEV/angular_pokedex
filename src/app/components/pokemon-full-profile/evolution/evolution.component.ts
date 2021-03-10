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
        this.http.fetchPokemonSpecInfo(data.evolution_chain.url).subscribe((data: any) => {
          let phaseBefore = data.chain.species;
          let nextEvolution = data.chain.evolves_to.find(pokemon => pokemon.evolves_to);

          while(nextEvolution !== undefined) {
            this.addPhase(phaseBefore, nextEvolution);
            phaseBefore = nextEvolution.species;
            nextEvolution = nextEvolution.evolves_to[0];
          }

          // Hitmonchan was the example used for this case
          // When in the API the evolves_to prop is empty
          // Yet the other stages of evolution are present in the primary evolves_to prop
          if(nextEvolution === undefined && data.chain.evolves_to.length > 1) {
            for(let i = 0; i < data.chain.evolves_to.length - 1; i++) {
              this.addPhase(data.chain.evolves_to[i].species, data.chain.evolves_to[i + 1]);
            }
          }

        })
      });
    }
  }

  allPhases(phase) {
    this.evolutionPhase = [...this.evolutionPhase, phase];
  }

  addPhase(phaseBefore, nextPhase) {
    const phaseAfter = {
      ...nextPhase.species
    };

    this.allPhases([ phaseBefore, phaseAfter ]);
  }

}
