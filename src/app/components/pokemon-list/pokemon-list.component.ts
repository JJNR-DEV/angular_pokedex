import { Component, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { fromEvent, merge } from 'rxjs';
import { map, filter, debounceTime, distinct, tap, mergeMap, pluck } from 'rxjs/operators';

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

  fetchesMade = this.pokemonStorage.getFetchesToMake();
  counter: number = this.fetchesMade;

  loading: boolean = false;
  view = this.pokemonStorage.viewLastPokemonClicked();

  // When user returns from Profile page the view should scroll to last clicked pokemon
  ngAfterViewInit() {
    this.pokemonStorage.totalPokemonsRendered.subscribe(val => {
      // If the whole list up until the last point as been loaded
      // And the last clicked value is not at initial point
      if(val === this.pokemonStorage.pokemonList.length && this.view > 0) {
        this.pokeItem.get(this.view).nativeElement.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });

        // After taking the user to last pokemon clicked, reset the number
        this.pokemonStorage.setLastPokemonClicked(0);
        this.view = this.pokemonStorage.viewLastPokemonClicked();
      }
    })
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

  // Listen to scroll value and move forward with a distinct value
  private pageToLoad$ = this.pageByScroll$
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
      tap(() => {
        // Wait a second so that all pokemons render and user does not trigger
        // another fetch of new pokemons by scrolling too fast
        setTimeout(() => this.loading = false, 1000);
      })
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
