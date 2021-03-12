import { Component, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { fromEvent, BehaviorSubject, merge } from 'rxjs';
import { map, filter, debounceTime, distinct, tap, concatMap, scan, mergeMap, distinctUntilChanged } from 'rxjs/operators';

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

  fetchesMade = this.pokemonStorage.getFetchesToMake()
  pageByManual$ = new BehaviorSubject(this.fetchesMade);
  counter: number = this.fetchesMade;

  loading: boolean = false;

  // When user returns from Profile page
  ngAfterViewInit() {
    const view = this.pokemonStorage.viewLastPokemonClicked();

    if(view > 0) {
      this.pokemonStorage.totalPokemonsRendered.subscribe(val => {
        // If the whole list up until the last point as been loaded
        if(val === this.pokemonStorage.pokemonList.length) {
          // Scroll to last clicked pokemon
          this.pokeItem.get(view).nativeElement.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
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


  pokemons$ = merge(this.pageToLoad$, this.getPokemons.onListReady$)
    .pipe(
      tap(res => {
        if(typeof res === 'number'){
          this.pokemonStorage.setFetchesToMake(res)
        }
      }),
      mergeMap(() => {
        if(this.getPokemons.listReady$.value === false && this.pokemonStorage.getPokemonList().length === 0) {
          return [];
        } else if(this.pokemonStorage.getPokemonList().length === this.pokemonStorage.getFetchesToMake() * 20) {
          return [this.addPokemonsToList(this.getPokemons.pokemons.value)];
        } else {
          return [this.pokemonStorage.getPokemonList()];
        }
      }),
      tap(() => this.loading = false)
    ); 

  addPokemonsToList(data) {
    let indexStart = this.pokemonStorage.getFetchesToMake() * this.numberOfPokemons;
    const counter = indexStart + this.numberOfPokemons;

    for(indexStart; indexStart < counter; indexStart++) {
      this.pokemonStorage.setPokemonList(data[indexStart]);
    }

    return this.pokemonStorage.getPokemonList();
  }
}