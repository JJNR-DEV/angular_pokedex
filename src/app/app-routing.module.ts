import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PokemonListComponent } from './components/pokemon-list/pokemon-list.component';
import { PokemonFullProfileComponent } from './components/pokemon-full-profile/pokemon-full-profile.component';

const routes: Routes = [
  { path: '', component: PokemonListComponent },
  { path: 'profile/:name', component: PokemonFullProfileComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
