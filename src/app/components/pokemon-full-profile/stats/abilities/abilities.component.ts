import { Component, Input, OnInit } from '@angular/core';
import { PokemonItemService } from '../../../../services/pokemon-item.service';

@Component({
  selector: 'app-abilities',
  templateUrl: './abilities.component.html',
  styleUrls: ['./abilities.component.sass']
})
export class AbilitiesComponent implements OnInit {
  @Input() pokemonAbilities;
  @Input() pokemonColor;

  abilityEntries: object[] = [];

  constructor(private http: PokemonItemService) { }

  ngOnInit(): void {
    this.pokemonAbilities.map(ability => {
      this.http._fetchPokemonSpecInfo(ability.ability.url).subscribe((data: any) => {
        const t = data.effect_entries.filter(entry => entry.language.name === 'en');

        this.abilityEntries = [
          ...this.abilityEntries,
          {
            name: ability.ability.name,
            description: t[0].short_effect
          } 
        ];
      });
    });
  }

}
