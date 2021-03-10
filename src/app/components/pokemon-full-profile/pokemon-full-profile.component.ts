import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { faChevronCircleLeft } from '@fortawesome/free-solid-svg-icons'

import { PokemonItemService } from '../../services/pokemon-item.service';
import { PokemonStorage } from '../../services/pokemon-storage.service';

@Component({
  selector: 'app-pokemon-full-profile',
  templateUrl: './pokemon-full-profile.component.html',
  styleUrls: ['./pokemon-full-profile.component.sass']
})
export class PokemonFullProfileComponent implements OnInit {
  constructor( 
    private route: ActivatedRoute, 
    private dataHandler: PokemonItemService ,
    private location: Location,
    private pokemonStorage: PokemonStorage
  ){ 
    this.pokemonStorage.resetPokemonRendered()
  }

  // Font Awesome Icon
  faChevronCircleLeft = faChevronCircleLeft;

  pokemonName: string;
  avatarImg: string;
  pokemonDesc: string;
  profileColor: string;
  pokemonID: number;
  isLoading: boolean = true;

  pokemonTypes = [];
  // Shape for Pokemon type
  typeIcon: string = 'tags';

  pokemonStats: object[];
  pokemonMoves: object[];
  pokemonAbilities: object[];

  ngOnInit(): void {
    // Collect pokemon name from params
    this.route.params.subscribe(p => this.pokemonName = p['name']);

    // Get all data about pokemon
    this.dataHandler.pokemonData(this.pokemonName).subscribe((data: any) => {
      this.pokemonID = data.id;

      // Avatar img
      this.avatarImg = data.sprites.other.dream_world.front_default;

      // Description
      this.getDescription(data.id);

      // Types
      this.pokemonTypes = data.types.map(t => t.type);

      // Profile Colour
      this.profileColor = this.pokemonTypes[0].name;

      // Stats
      this.pokemonStats = data.stats;

      // Moves
      this.pokemonMoves = data.moves;

      // Abilities
      this.pokemonAbilities = data.abilities;
    });
  };

  getDescription(id: number) {
    // The description I found with more characteristics
    this.dataHandler.pokemonCharacteristics(id).subscribe((details: any) => details.flavor_text_entries.filter(
      (desc: {
        flavor_text: string,
        version: {
          name: string
        }
    }) => {
      if(desc.version.name === 'ruby') {
        // Edit the name to be only first letter capital
        const name = this.pokemonName.charAt(0).toUpperCase() + this.pokemonName.slice(1);
        let textEdited = desc.flavor_text.replace(desc.flavor_text.split(" ")[0], name);
        textEdited = textEdited.replace('POKéMON', 'pokémon')

        this.pokemonDesc = textEdited;
      } 

      // Data has been fetch
      this.isLoading = false;
    }));
  };

  showStats: boolean = true;
  showEvolution: boolean = false;
  showMoves: boolean = false;

  childDisplay(child) {
    switch(child) {
      case 'evolution':
        this.showEvolution = true;
        this.showMoves = false;
        this.showStats = false;
        break;
      case 'moves':
        this.showMoves = true;
        this.showEvolution = false;
        this.showStats = false;
        break;
      default:
        this.showStats = true;
        this.showMoves = false;
        this.showEvolution = false;
    }
  }

  goBack() {
    this.location.back();
  }
  
}
