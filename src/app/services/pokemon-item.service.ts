import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, merge } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { memoize } from './memoize';

import { AppPokemonsAPI } from '../models/AllPokemonsAPI';

@Injectable({
  providedIn: 'root'
})

export class PokemonItemService {

  // Memoize Functions
  _pokemonData: (name: string) => any;
  _pokemonCharacteristics: (id: number) => any;
  _fetchPokemonSpecInfo: (url: string) => any;

  constructor(private http: HttpClient) { 
    this._pokemonData = memoize(this.pokemonData.bind(this));
    this._pokemonCharacteristics = memoize(this.pokemonCharacteristics.bind(this));
    this._fetchPokemonSpecInfo = memoize(this.fetchPokemonSpecInfo.bind(this));
  }

  pokemons = new BehaviorSubject([]);
  pokemonNameMatches = [];
  numberOfPokemons: number = 20;

  listReady$ = new BehaviorSubject(false);

  // When all pokemons have been fetched
  onListReady$ = merge(this.pokemons)
    .pipe(
      filter(data => data.length > 0),
      tap(() => this.listReady$.next(true))
    )

  getAllPokemons(): Observable<AppPokemonsAPI> {
    const url = 'https://pokeapi.co/api/v2/pokemon/';

    return this.http.get<AppPokemonsAPI>(url);
  }

  getAllPokemonNames() {
    const url = 'https://pokeapi.co/api/v2/pokemon/?limit=';
    
    this.getAllPokemons().subscribe(data => {
      this.getPokemonsFromUrl(`${url}${data.count}`).subscribe(res => {
        this.pokemons.next(res.results);
      })
    });
  }

  lookThroughPokemonNames(name) {
    this.pokemonNameMatches = [];

    this.pokemons[0].filter(pokemons => {
      if(pokemons.name.includes(name)) {
        this.pokemonNameMatches = [...this.pokemonNameMatches, pokemons.name];
      }
    })
  }

  // Only used in this file
  getPokemonsFromUrl(url: string): Observable<AppPokemonsAPI> {
    return this.http.get<AppPokemonsAPI>(url);
  }

  pokemonData(name: string) {
    const url = `https://pokeapi.co/api/v2/pokemon/${name}`;
    return this.http.get(url);
  }

  pokemonCharacteristics(id: number) {
    const url = `https://pokeapi.co/api/v2/pokemon-species/${id}`;
    return this.http.get(url);
  }

  fetchPokemonSpecInfo(url: string) {
    return this.http.get(url);
  }
}
