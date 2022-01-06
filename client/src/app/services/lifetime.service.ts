import { Injectable, OnDestroy } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LifetimeService extends Observable<void> implements OnDestroy {
  private readonly life$ = new Subject<void>();

  constructor() {
    super(subscriber => this.life$.subscribe(subscriber));
  }

  ngOnDestroy() {
    this.life$.next();
    this.life$.complete();
  }
}
