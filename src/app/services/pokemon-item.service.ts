import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AppPokemonsAPI } from '../models/AllPokemonsAPI';

@Injectable({
  providedIn: 'root'
})

export class PokemonItemService {

  constructor(private http: HttpClient) { }

  pokemonNames = [];
  pokemonNameMatches = [];

  getAllPokemons(): Observable<AppPokemonsAPI> {
    const url = 'https://pokeapi.co/api/v2/pokemon/';

    return this.http.get<AppPokemonsAPI>(url);
  }

  getAllPokemonNames() {
    const url = 'https://pokeapi.co/api/v2/pokemon/?limit=';
    
    this.getAllPokemons().subscribe(data => {
      this.getPokemonsNextPage(`${url}${data.count}`).subscribe(res => {
        this.pokemonNames = [...this.pokemonNames, res.results];
      })
    });
  }

  lookThroughPokemonNames(name) {
    console.log(name);
    this.pokemonNameMatches = [];

    this.pokemonNames[0].filter(pokemons => {
      if(pokemons.name.includes(name)) {
        this.pokemonNameMatches = [...this.pokemonNameMatches, pokemons.name];
      }
    })
  }

  getPokemonsNextPage(url): Observable<AppPokemonsAPI> {
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
