import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchTriggerService {
  private actionSource = new Subject<void>();
  action$ = this.actionSource.asObservable();

  triggerAction() {
    this.actionSource.next();
  }
}
