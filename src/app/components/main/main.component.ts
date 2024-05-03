import { Component } from '@angular/core';
import { RecipeCardComponent } from '../recipe-card/recipe-card.component';
import { RecipeSearchBoxComponent } from '../recipe-search-box/recipe-search-box.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RecipeSearchBoxComponent, RecipeCardComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  title = 'My Recipe';
}
