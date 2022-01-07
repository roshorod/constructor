import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, Subject } from "rxjs";
import { switchMap, tap, map, withLatestFrom, filter, takeUntil } from "rxjs/operators";
import { Element } from "@renderer/models/element";
import { WebSocketType, WebSocketAction, WebSocketPutElement, IResponse, WebSocketService } from "@websocket";
import { LifetimeService } from "./lifetime.service";

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private _elements$ = new BehaviorSubject(<Element[]>[]);

  public readonly elements$ = this._elements$.asObservable();

  private store$ = new Observable(observer => {
    observer.next();
  }).pipe(takeUntil(this.lifetime$));

  /**
   * @description Attach to the base observable websocket request,
   * which get all stored elements from server.
   *
   * @example Map of stream from server:
   * storeSync$.pipe(map((resp: IResponse) => resp.elements ? resp.elements : []));
   */
  @WebSocketAction({ action: WebSocketType.GetAll })
  private storeSync$(): Observable<any> {
    return this.store$
  }

  private storeElementMap$(element: Element): Observable<Element> {
    return this.store$
      .pipe(
        switchMap(() => of(element))
      );
  }

  public fetch(): Observable<Element[]> {
    return this.storeSync$()
      .pipe(
        map((resp: IResponse) => resp.elements ? resp.elements : []),
        map((elements: Element[]) => elements
          .filter((element: Element) => {
            if (element != null || element != undefined) {
              if (element.position == undefined)
                element.position = { cellX: 0, cellY: 0, height: 1, width: 1 };

              return element;
            }
            else return;
          })),
        switchMap((elements: Element[]) => {
          this._elements$.next(elements);

          return this.elements$;
        })
      );
  }

  @WebSocketPutElement({ action: WebSocketType.Create })
  public create(element: Element): Observable<Element> {
    return this.storeElementMap$(element)
      .pipe(
        withLatestFrom(this._elements$),
        map(([element, elements]) => {
          this._elements$.next(elements
            .filter(val => val.id != element.id).concat(element));

          return element;
        })
      );
  }

  @WebSocketPutElement({ action: WebSocketType.Update })
  public update(element: Element): Observable<Element> {
    return this.storeElementMap$(element)
      .pipe(
        withLatestFrom(this.elements$),
        map(([element, elements]) => {
          this._elements$.next(elements
            .filter(val => val.id != element.id).concat(element));

          return element;
        })
      );
  }

  @WebSocketPutElement({ action: WebSocketType.Delete })
  public remove(element: Element): Observable<Element> {
    return this.storeElementMap$(element)
      .pipe(
        withLatestFrom(this.elements$),
        map(([element, elements]) => {
          this._elements$.next(elements
            .filter(val => val.id != element.id));

          return element;
        })
      );
  }

  private _chosen$ = new Subject<Element | undefined>();

  public readonly chosen$ = this._chosen$.asObservable();

  public select(target: Element | undefined): Observable<Element | undefined> {
    this._chosen$.next(target);

    return this._chosen$.asObservable();
  }

  constructor(
    websocket: WebSocketService,
    private lifetime$: LifetimeService
  ) {
    websocket.isConnected$
      .pipe(
        filter(val => val === true))
      .subscribe(() => this.fetch().subscribe());
  }
}
