import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SpoonacularService } from '../../services/spoonacular.service';
import { SearchTriggerService } from '../../services/search-trigger.service';

@Component({
  selector: 'app-recipe-search-box',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './recipe-search-box.component.html',
  styleUrl: './recipe-search-box.component.scss',
})
export class RecipeSearchBoxComponent {
  queryFormControl = new FormControl('');

  constructor(
    private spoonacularService: SpoonacularService,
    private searchTriggerService: SearchTriggerService
  ) {}

  onKeyDown() {
    const query = this.queryFormControl.value || '';
    this.spoonacularService.fetchRecipes(query).subscribe({
      next: (recipes) => {
        this.searchTriggerService.triggerAction(recipes);
      },
      error: (error) => {
        this.searchTriggerService.triggerAction([], error); // trigger with empty results and error message
      },
    });
  }
}
