import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { distinct, filter } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class PokemonStorage {

    constructor() { }

    pokemonList: object[] = [];
    fecthesToMake: number = 0;
    cache = [];
    totalPokemonsRendered = new BehaviorSubject(0);

    setPokemonList(list) {
        this.pokemonList = [...this.pokemonList, list];
    }

    getPokemonList() {
        return this.pokemonList;
    }

    setFetchesToMake(page) {
        this.fecthesToMake = page;
    }

    getFetchesToMake() {
        return this.fecthesToMake;
    }


    scrollPosition: number = 0;

    setLastPokemonClicked(position) {
        this.scrollPosition = position;
    }

    viewLastPokemonClicked() {
        return this.scrollPosition;
    }

    pokemonsRendered() {
        this.totalPokemonsRendered.next(this.totalPokemonsRendered.getValue() + 1);
    }

    resetPokemonsRendered() {
        this.totalPokemonsRendered.next(0);
    }
}
