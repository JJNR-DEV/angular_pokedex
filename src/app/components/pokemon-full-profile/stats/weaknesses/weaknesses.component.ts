import { Component, Input, OnInit } from '@angular/core';
import { nextTick } from 'process';

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

  /*
(data: any) => {

        data.damage_relations.double_damage_from.map((damage: {
          name: string
        }) => this.doubleDamage = [...this.doubleDamage, damage.name]);

        data.damage_relations.half_damage_from.map((damage: {
          name: string
        }) => {
          console.log(damage.name);
          if(this.doubleDamage.find(d => damage.name === d)) {
            console.log('here')
            return;
          } else {
            console.log('TThere')
            this.halfDamage = [...this.halfDamage, damage.name];
          }
        });

      }
  */

  ngOnInit(): void {

    this.types.map((type: any) => {
      this.http.fetchPokemonSpecInfo(type.url).subscribe((data: any) => {

        data.damage_relations.double_damage_from.map((damage: {
          name: string
        }) => this.doubleDamage = [...this.doubleDamage, damage.name]);

        data.damage_relations.half_damage_from.map((damage: {
          name: string
        }) => {
          if(this.doubleDamage.find(d => damage.name === d)) {
            console.log('here')
            return;
          } else {
            console.log('TThere')
            this.halfDamage = [...this.halfDamage, damage.name];
          }
        });

      });
    });

  }

}
