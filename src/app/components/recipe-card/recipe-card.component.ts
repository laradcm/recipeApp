import { CommonModule } from '@angular/common';
import { Component, SecurityContext, signal } from '@angular/core';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { RecipeCardContentType, RecipeType } from '../../models/card.model';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { DomSanitizer } from '@angular/platform-browser';
import { SpoonacularService } from '../../services/spoonacular.service';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [
    MatCard,
    MatCardActions,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    CommonModule,
    MatGridListModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatDividerModule,
  ],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.scss',
  animations: [],
})
export class RecipeCardComponent {
  recipeCards = signal<RecipeCardContentType[]>([]);

  constructor(
    private sanitizer: DomSanitizer,
    private spoonacularService: SpoonacularService
  ) { }

  navigateToExternalURL(externalURL: string) {
    if (this.sanitizer.sanitize(SecurityContext.URL, externalURL)) {
      window.open(externalURL, '_blank'); // Opens the URL in a new tab
    }
  }

  ngOnInit(): void {
    this.spoonacularService.recipes$.subscribe((recipes) => {
      const recipeCards: RecipeCardContentType[] = recipes.map(
        (recipe: RecipeType) => ({
          id: recipe.id,
          title: recipe.title,
          vegetarian: recipe.vegetarian,
          vegan: recipe.vegan,
          glutenFree: recipe.glutenFree,
          dairyFree: recipe.dairyFree,
          image: recipe.image,
          readyInMinutes: recipe.readyInMinutes,
          servings: recipe.servings,
          summary: this.sanitizer.sanitize(SecurityContext.HTML, recipe.summary) || '',
          sourceUrl:
            this.sanitizer.sanitize(SecurityContext.URL, recipe.sourceUrl) || '',
          aggregateLikes: recipe.aggregateLikes,
        })
      );

      this.recipeCards.set(recipeCards);
    });
  }
}
