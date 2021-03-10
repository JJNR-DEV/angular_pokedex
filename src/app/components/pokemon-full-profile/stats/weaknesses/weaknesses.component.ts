import { Component, Input, OnInit } from '@angular/core';

import { PokemonItemService } from '../../../../services/pokemon-item.service';

@Component({
  selector: 'app-weaknesses',
  templateUrl: './weaknesses.component.html',
  styleUrls: ['./weaknesses.component.sass']
})
export class WeaknessesComponent implements OnInit {
  @Input() types: object[];

  doubleDamage = [];
  halfDamage = [];

  constructor(private http: PokemonItemService) { }

  ngOnInit(): void {
    const observable = {
      next(data, counterArray) {
        return data.filter(({ name }: {
          name: string
        }) => counterArray.includes(name) === false);
      }
    };

    // So there are no duplicate between double damage and half
    // If it exists in both then it should be only displayed in double damage
    this.types.map((type: any) => {
      this.http.fetchPokemonSpecInfo(type.url).subscribe((data: any) => {
        this.doubleDamage = [...observable.next(data.damage_relations.double_damage_from, this.doubleDamage)];
        this.halfDamage = [...observable.next(data.damage_relations.half_damage_from, this.doubleDamage)];
      });
    });
  };

}
