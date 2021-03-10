import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PokemonListComponent } from './components/pokemon-list/pokemon-list.component';
import { PokemonListItemComponent } from './components/pokemon-list-item/pokemon-list-item.component';
import { PokemonTypeComponent } from './components/pokemon-type/pokemon-type.component';
import { PokemonFullProfileComponent } from './components/pokemon-full-profile/pokemon-full-profile.component';
import { StatsComponent } from './components/pokemon-full-profile/stats/stats.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EvolutionComponent } from './components/pokemon-full-profile/evolution/evolution.component';
import { EvolutionPhaseViewComponent } from './components/pokemon-full-profile/evolution/evolution-phase-view/evolution-phase-view.component';
import { MovesComponent } from './components/pokemon-full-profile/moves/moves.component';
import { WeaknessesComponent } from './components/pokemon-full-profile/stats/weaknesses/weaknesses.component';
import { AbilitiesComponent } from './components/pokemon-full-profile/stats/abilities/abilities.component';

@NgModule({
  declarations: [
    AppComponent,
    PokemonListComponent,
    PokemonListItemComponent,
    PokemonTypeComponent,
    PokemonFullProfileComponent,
    StatsComponent,
    EvolutionComponent,
    EvolutionPhaseViewComponent,
    MovesComponent,
    WeaknessesComponent,
    AbilitiesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
