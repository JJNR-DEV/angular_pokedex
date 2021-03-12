import { Component, OnInit, Input } from '@angular/core';

import { PokemonItemService } from '../../services/pokemon-item.service';
import { PokemonStorage } from '../../services/pokemon-storage.service';

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

  @Input() userScrollPosition: number;

  @Input() tabindex: number;

  avatarImg: string;
  pokemonId: string;

  pokemonTypes: string[];
  // Shape for Pokemon type
  typeIcon: string = 'icons';
  
  constructor(
    private getDetails: PokemonItemService, 
    private pokemonStorage: PokemonStorage) { }

  setLastClicked() {
    this.pokemonStorage.setLastPokemonClicked(this.tabindex);
  };
  
  ngOnInit(): void {
    this.getDetails._pokemonData(this.pokemon.name).subscribe(this.dataReady.bind(this))
  };

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
    if(e.path === undefined && e.composedPath){
      const elements = e.composedPath();
      elements[2].style="display: flex";
    } else {
      e.path[2].style="display: flex";
    }

    this.pokemonStorage.pokemonsRendered();
  }
}
