import { Component, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { fromEvent, BehaviorSubject, merge } from 'rxjs';
import { map, filter, debounceTime, distinct, mergeMap, tap, switchMap, concatMap } from 'rxjs/operators';

import { PokemonItemService } from '../../services/pokemon-item.service';
import { PokemonStorage } from '../../services/pokemon-storage.service';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.sass']
})
export class PokemonListComponent implements AfterViewInit {
  constructor(
    private getPokemons: PokemonItemService, 
    private pokemonStorage: PokemonStorage
  ) { }

  @ViewChildren('pokeItem', { read: ElementRef }) pokeItem: QueryList<ElementRef>;

  itemHeight: number = 75;
  numberOfPokemons: number = 20;

  fetchesMade = this.pokemonStorage.getFetchesMade()
  pageByManual$ = new BehaviorSubject(this.fetchesMade);
  counter: number = this.fetchesMade;

  loading: boolean = false;

  // When user returns from Profile page
  ngAfterViewInit() {
    const view = this.pokemonStorage.viewLastPokemonClicked();

    if(view > 0) {
      this.pokemonStorage.totalPokemonsRendered.subscribe(val => {
        // Scroll to last pokemon clicked
        if(val === this.pokemonStorage.pokemonList.length) {
          this.pokeItem.get(view).nativeElement.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });

          // After scrolling into view clear the scrolling
          this.pokemonStorage.resetPokemonRendered();
        }
      })
    }
  }

  private pageByScroll$ = fromEvent(window, "scroll")
    .pipe(
      map(() => window.scrollY),
      // User got to the bottom of the page
      filter(current => current >=  document.body.clientHeight - window.innerHeight),
      tap(() => this.loading = true),
      debounceTime(200),
      distinct(),
      map(y => {
        const roundPosition = Math.ceil(
          (y + window.innerHeight)/ (this.itemHeight * this.numberOfPokemons)
        )

        // roundPosition is 1 when user returns from pokemon profile
        roundPosition === 1 ? 
          this.counter = this.counter : 
          this.counter = this.counter + 1;

        return this.counter;
      })
    );

  // Checks all items emitted by Observable and return the distinct value
  private pageToLoad$ = merge(this.pageByManual$, this.pageByScroll$)
    .pipe(
      distinct()
    );
  
  pokemons$ = this.pageToLoad$
    .pipe(
      concatMap((page: number) => {
        const existingList = this.pokemonStorage.getPokemonList();

        if(existingList.length !== 0 && page === this.fetchesMade) {
          return [this.handleExistingList()];
        } else {
          return this.createList(page);
        } 
      }),
      map(newList => newList),
      tap(() => this.loading = false)
    );

  createList(page) {
    return this.getPokemons.getPokemonsNextPage(`https://pokeapi.co/api/v2/pokemon/?offset=${page * 20}&limit=${this.numberOfPokemons}`)
      .pipe(
        map((res: any) => res.results),
        map(pokemons => {
          pokemons.map(pokemon => this.pokemonStorage.setPokemonList(pokemon));
          return this.pokemonStorage.getPokemonList();
        }),
        tap(() => this.pokemonStorage.setFetchesMade(page))
      )
  }

  handleExistingList() {
    return this.pokemonStorage.getPokemonList();
  }

}
