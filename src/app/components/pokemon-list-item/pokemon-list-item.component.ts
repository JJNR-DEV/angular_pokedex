import { Component, OnInit, Input } from '@angular/core';

import { PokemonItemService } from '../../services/pokemon-item.service';

@Component({
  selector: 'app-pokemon-list-item',
  templateUrl: './pokemon-list-item.component.html',
  styleUrls: ['./pokemon-list-item.component.sass']
})
export class PokemonListItemComponent implements OnInit {
  @Input() pokemon: {
    name: string
    url: string
  };

  avatarImg: string;
  pokemonId: string;

  pokemonTypes: string[];
  // Shape for Pokemon type
  typeIcon: string = 'icons';
  
  constructor(private getDetails: PokemonItemService) { }
  
  ngOnInit(): void {
    this.getDetails.pokemonData(this.pokemon.name).subscribe(this.dataReady.bind(this))
  }

  defineId(id: number) {
    const stringID = id.toString();

    if (stringID.length === 1) {
      this.pokemonId = `00${id}`;
    } else if (stringID.length === 2) {
      this.pokemonId = `0${id}`;
    } else {
      this.pokemonId = stringID;
    }
  }

  dataReady(data: any) {
    // Pokemon ID
    this.defineId(data.id);

    // Property for svg avatar
    this.avatarImg = data.sprites.other.dream_world.front_default;

    // Pokemon types
    this.pokemonTypes = data.types.map(t => t.type.name);
  }

  onImgLoad(e)  {
    // When image is ready display the whole container
    e.path[2].style="display: flex"
  }
}
