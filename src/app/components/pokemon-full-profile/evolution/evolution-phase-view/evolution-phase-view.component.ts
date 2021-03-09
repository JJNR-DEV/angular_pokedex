import { Component, Input, OnInit } from '@angular/core';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';

import { PokemonItemService } from '../../../../services/pokemon-item.service';

@Component({
  selector: 'app-evolution-phase-view',
  templateUrl: './evolution-phase-view.component.html',
  styleUrls: ['./evolution-phase-view.component.sass']
})
export class EvolutionPhaseViewComponent implements OnInit {
  @Input() phase;
  @Input() pokemonColor;

  phaseBeforeImg: string;
  phaseAfterImg: string;

  faAngleRight = faAngleRight;

  constructor(private http: PokemonItemService) { }

  ngOnInit(): void {
    this.assignImg(this.phase[0].name, 'before');
    this.assignImg(this.phase[1].name, 'after');
  }

  assignImg(phase, element) {
    this.http.pokemonData(phase).subscribe((data: {
      sprites: {
        other: {
          dream_world: {
            front_default: string
          }
        }
      }
    }) => {
      element === 'before' ?
        this.phaseBeforeImg = data.sprites.other.dream_world.front_default :
        this.phaseAfterImg = data.sprites.other.dream_world.front_default
    })
  }

}
