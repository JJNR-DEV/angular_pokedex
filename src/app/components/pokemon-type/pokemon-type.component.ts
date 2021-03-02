import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-pokemon-type',
  templateUrl: './pokemon-type.component.html',
  styleUrls: ['./pokemon-type.component.sass']
})
export class PokemonTypeComponent implements OnInit {
  @Input() type: string;
  @Input() tagsIcons: 'tags' | 'icons';

  constructor() { }

  ngOnInit(): void { }

}
