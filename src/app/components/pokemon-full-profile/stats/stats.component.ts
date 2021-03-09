import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.sass', '../pokemon-full-profile.component.sass']
})
export class StatsComponent {
  @Input() stats: object[];
  @Input() pokemonColor: string;

  constructor() { }

  ngOnChanges() {
    if(this.stats) {
      this.stats.map(
        (stat: {
          base_stat: number,
          effort: number,
          stat: {
            name: string
          }
        }) => stat.stat.name = this.shortenNames(stat.stat.name))
    }
  }

  shortenNames(name) {
    switch(name) {
      case 'attack':
        return 'atk';
      case 'defense':
        return 'def';
      case 'special-attack':
        return 'satk';
      case 'special-defense':
        return 'sdef';
      case 'speed':
        return 'spd';
      default:
        return name;
    }
  }

  threeDigitStat(statVal) {
    if(statVal.toString().length === 1) {
      return `00${statVal}`;
    } else if(statVal.toString().length === 2) {
      return `0${statVal}`;
    } else {
      return statVal;
    }
  }

}