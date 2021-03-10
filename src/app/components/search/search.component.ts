import { Component } from '@angular/core';

import { PokemonItemService } from '../../services/pokemon-item.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.sass']
})
export class SearchComponent {

  constructor(private pokemonList: PokemonItemService) { }

  userInput: string = '';
  matches: string[] = [];
  displayMatches: 'flex' | 'none' = 'none';

  onSubmit(e) {
    e.preventDefault();
  }

  userInputFn(e) {
    this.pokemonList.lookThroughPokemonNames(e);
    this.matches = this.pokemonList.pokemonNameMatches;

    this.pokemonList.pokemonNameMatches.length > 0 && e !== '' ? 
      this.displayMatches = 'flex' : 
      this.displayMatches = 'none';
  }

}
