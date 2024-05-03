import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SpoonacularService } from '../../services/spoonacular.service';

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
export class RecipeSearchBoxComponent implements OnInit {
  queryFormControl = new FormControl('');

  constructor(private spoonacularService: SpoonacularService) {}

  onKeyDown() {
    this.spoonacularService.fetchRecipes(this.queryFormControl.value || '');
  }
  ngOnInit(): void {}
}
