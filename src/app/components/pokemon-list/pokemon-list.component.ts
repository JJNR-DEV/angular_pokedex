import { Component } from '@angular/core';
import { fromEvent, BehaviorSubject, merge } from 'rxjs';
import { map, filter, debounceTime, distinct, mergeMap, tap } from 'rxjs/operators';

import { PokemonItemService } from '../../services/pokemon-item.service';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.sass']
})
export class PokemonListComponent{
  constructor(private getPokemons: PokemonItemService) { 
  }

  allPokemons: object[] = [];
  itemHeight: number = 75;
  numberOfPokemons: number = 20;
  pageByManual$ = new BehaviorSubject(0);
  cache: object[] = [];
  loading: boolean = false;

  private pageByScroll$ = fromEvent(window, "scroll")
    .pipe(
      map(() => window.scrollY),
      // User got to the bottom of the page
      filter(current => current >=  document.body.clientHeight - window.innerHeight),
      tap(() => this.loading = true),
      debounceTime(200),
      distinct(),
      map(y => Math.ceil(
        (y + window.innerHeight)/ (this.itemHeight * this.numberOfPokemons)
      ))
    );

  private pageToLoad$ = merge(this.pageByManual$, this.pageByScroll$)
    .pipe(
      // When user starts scrolling
      distinct(),
      filter(page => this.cache[page-1] === undefined)
    );
  
  pokemons$ = this.pageToLoad$
    .pipe(
      tap(() => this.loading = false),
      mergeMap((page: number) => {
        return this.getPokemons.getPokemonsNextPage(`https://pokeapi.co/api/v2/pokemon/?offset=${page * 20}&limit=${this.numberOfPokemons}`)
          .pipe(
            map((res: any) => res.results),
            tap(res => {
              if(page === 0) {
                this.cache[0] = res
              } else {
                this.cache[page - 1] = res;
              }

              if((this.itemHeight * this.numberOfPokemons * page) < window.innerHeight) {
                this.pageByManual$.next(page + 1);
              }
            })
          )
      }),
      map((newList) => {
        newList.map(pokemon => this.allPokemons = [...this.allPokemons, pokemon])
        return this.allPokemons
      })
    );

}
