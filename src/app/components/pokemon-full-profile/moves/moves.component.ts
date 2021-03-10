import { Component, Input } from '@angular/core';

import { PokemonItemService } from '../../../services/pokemon-item.service';

@Component({
  selector: 'app-moves',
  templateUrl: './moves.component.html',
  styleUrls: ['./moves.component.sass']
})
export class MovesComponent {
  @Input() moves: object[];

  movesInfo = [];

  constructor(private http: PokemonItemService) { }

  ngOnChanges() { 
    if(this.moves) {
      const regex = /-/g;

      this.moves.map((move: {
        move: {
          name: string,
          url: string
        }
      }) => {
        this.http.fetchPokemonSpecInfo(move.move.url).subscribe((data: {
          type: {
            name: string
          }
        }) => {
          const name = move.move.name.replace(regex, ' ');

          this.movesInfo = [
            ...this.movesInfo, 
            {
              name,
              type: data.type.name
            }
          ]
        })
      });
    }
  }

}
