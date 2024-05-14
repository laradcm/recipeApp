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
import { SpoonacularService } from '../../services/spoonacular.service';
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
  // private triggerSubscription: Subscription | undefined;
  private triggerSubscription: Subscription | undefined;
  recipeCards = signal<RecipeCardContentType[]>([]);

  constructor(
    private sanitizer: DomSanitizer,
    private spoonacularService: SpoonacularService,
    private searchTriggerService: SearchTriggerService,
    private snackBar: MatSnackBar
  ) {
    //to react to the search component trigger action
    this.triggerSubscription =  this.searchTriggerService.action$.subscribe(() => {
      this.subscribeToRecipeService();
    });
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

  subscribeToRecipeService(): void {
    this.spoonacularService.recipes$.subscribe({
      next: (recipes) => {
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
              this.sanitizer.sanitize(SecurityContext.HTML, recipe.summary) ||
              '',
            sourceUrl:
              this.sanitizer.sanitize(SecurityContext.URL, recipe.sourceUrl) ||
              '',
            aggregateLikes: recipe.aggregateLikes,
          })
        );
        this.recipeCards.set(recipeCards);
      },
      // TODO: fix service and component side to handle completed and error states
      // error: (error) => {
      //   console.log(error.message);
      //   this.openSnackBar(
      //     `Error trying to fetch recipes ${error.error.message}`,
      //     'close'
      //   );
      // },
      // complete: () => {
      //   if (this.recipeCards.length === 0) {
      //     this.openSnackBar(`No Recipes Found`, 'close');
      //   }
      // },
    });
  }

  ngOnDestroy(): void {
    //subscription could be undefined if no request was sent, in that case, do not call the unsubscribe method
    // if (this.triggerSubscription) {
    //   this.triggerSubscription.unsubscribe();
    // }
    if (this.triggerSubscription) {
      this.triggerSubscription.unsubscribe();
    }
  }
}
