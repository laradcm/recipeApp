import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpoonacularService {
  constructor(private http: HttpClient) {}
  private apiKey = environment.SPOONACULAR_API_KEY;
  private recipesSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(
    []
  );
  recipes$: Observable<any[]> = this.recipesSubject.asObservable();

  fetchRecipes(query: string): void {
    const url = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&addRecipeInformation=true&addRecipeNutrition=false&limitLicense=true&addWinePairing=false&addTasteData=false&number=5`; //i dont have moneys TT_TT
    const headers = new HttpHeaders().set('x-api-key', this.apiKey);

    this.http.get(url, { headers }).subscribe((data: any) => {
      this.recipesSubject.next(data.results);
    });
  }
}
