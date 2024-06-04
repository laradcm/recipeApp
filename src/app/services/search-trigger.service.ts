import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchTriggerService {
  private actionSubject = new Subject<any>();
  private errorSubject = new Subject<any>();
  action$ = this.actionSubject.asObservable();
  error$ = this.errorSubject.asObservable();

  triggerAction(recipes: any[], error?: any) {
    if (error) {
      this.errorSubject.next(error);
    } else {
      this.actionSubject.next(recipes);
    }
  }
}
