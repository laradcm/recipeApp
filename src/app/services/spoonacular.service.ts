import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { map, Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpoonacularService {
  constructor(private http: HttpClient) {}
  private apiKey = environment.SPOONACULAR_API_KEY;

  fetchRecipes(query: string): Observable<any> {
    const url = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&addRecipeInformation=true&addRecipeNutrition=false&limitLicense=true&addWinePairing=false&addTasteData=false&number=5`; //i dont have moneys TT_TT

    const headers = new HttpHeaders().set('x-api-key', this.apiKey);

    //cold observable that completes each time a request is sent
    return this.http.get<any>(url, { headers }).pipe(
      map((data) => data.results),
      catchError((error) => {
        console.error('Error fetching recipes:', error);
        return throwError(
          () => new Error(`Failed to fetch recipes: ${error.error.message}`)
        );
      })
    );
  }
}
