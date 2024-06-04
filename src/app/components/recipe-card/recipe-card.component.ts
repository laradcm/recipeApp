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
import { MatButtonModule } from '@angular/material/button';
import { RecipeCardContentType, RecipeType } from '../../models/card.model';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { DomSanitizer } from '@angular/platform-browser';
import { SearchTriggerService } from '../../services/search-trigger.service';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatDividerModule,
    TruncatePipe,
    MatTooltipModule,
  ],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.scss',
  animations: [],
})
export class RecipeCardComponent {
  private subscriptions: Subscription[] = [];
  recipeCards = signal<RecipeCardContentType[]>([]);

  constructor(
    private sanitizer: DomSanitizer,
    private searchTriggerService: SearchTriggerService,
    private snackBar: MatSnackBar
  ) {
    //to react to the search component trigger action
    this.subscriptions.push(
      this.searchTriggerService.action$.subscribe({
        next: (recipes) => {
          if (recipes.length > 0) {
            this.updateRecipeCards(recipes);
          } else {
            this.openSnackBar('No Recipes Found', 'close');
          }
        },
      })
    );

    this.subscriptions.push(
      this.searchTriggerService.error$.subscribe({
        next: (error) => {
          console.error('Error in RecipeCardComponent:', error);
          this.openSnackBar(`${error}`, 'Close');
        },
      })
    );
  }

  navigateToExternalURL(externalURL: string) {
    if (this.sanitizer.sanitize(SecurityContext.URL, externalURL)) {
      window.open(externalURL, '_blank');
    }
  }

  openSnackBar(message: string, action: string = 'Dismiss'): void {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  updateRecipeCards(recipes: any[]) {
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
        summary:
          this.sanitizer.sanitize(SecurityContext.HTML, recipe.summary) || '',
        sourceUrl:
          this.sanitizer.sanitize(SecurityContext.URL, recipe.sourceUrl) || '',
        aggregateLikes: recipe.aggregateLikes,
      })
    );
    this.recipeCards.set(recipeCards);
  }

  ngOnDestroy(): void {
    //subscription could be undefined if no request was sent, in that case, do not call the unsubscribe method
    if (this.subscriptions.length) {
      this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    }
  }
}
