import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject} from "rxjs";
import { switchMap, tap, map,
         withLatestFrom, filter, distinctUntilChanged} from "rxjs/operators";
import { ApiClientSerivce } from "@services/api-client.service";
import { Element } from "@renderer/models/element";

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private _chosen$ = new Subject<Element>();
  public readonly chosen$ = this._chosen$.asObservable()
    .pipe(
      /*
       * Resolve problem when subscribers emit next value.
       * Which make re rendering for same element.
       * When changed return false
       */
      distinctUntilChanged((first: Element | undefined, last: Element | undefined) => {
        if (last && first) {
          const firstPos = first.position;
          const lastPos = last.position;
          let changed = false;

          if (first.id != last.id)
            changed = false;
          else if (
            firstPos.cellX != lastPos.cellX ||
            firstPos.cellY != lastPos.cellY ||
            firstPos.width != lastPos.width ||
            firstPos.height != lastPos.height)
            changed = false;
          else
            changed = true;

          return changed;
        }
        else return false;
      })
    );

  /*
   * Consider make websocket connection with server,
   * when session start send all array,
   * after client add element just extend stream
   */
  private _elements$ = new BehaviorSubject(<Element[]>[]);
  public elements$ = this._elements$.asObservable();

  public select(target: Element | undefined): Observable<Element> {
    this._chosen$.next(target);

    return this._chosen$.asObservable();
  }

  public clear() {
    this._chosen$.next(undefined);
  }

  public fetch(): Observable<Element[]> {
    return this.api.getElements()
      .pipe(
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

  /*
  * Get element from ajax and take container
  * and requested element then filter same id.
  */
  public recive(id: string): Observable<Element> {
    return this.api.getElement(id)
      .pipe(
        withLatestFrom(this.elements$),
        map(([element, elements]) => {
          const temp = elements.filter(val => val.id != element.id).concat(element);
          this._elements$.next(temp);

          return element;
        })
      );
  }

  public create(element: Element): Observable<Element> {
    return this.api.postElement(element)
      .pipe(
        switchMap((id: { id: string }) => {
          if (element) {
            element.id = id.id
            return this.recive(element.id);
          }
          else throw new Error('Element not exists');
        })
      );
  }

  public update(element: Element): Observable<Element> {
    return this.api.postElementById(element)
      .pipe(
        tap({
          next: () => {
            if (element?.id)
              var sub = this.recive(element.id)
                .subscribe(() => sub.unsubscribe());
          },
          error: console.error,
        })
      );
  }

  public remove(element: Element): Observable<Object> {
    return this.api.deleteElement(element)
      .pipe(
        tap({
          next: () => {
            const sub = this.fetch().subscribe(() => sub.unsubscribe());
          },
          error: console.error,
        })
      );
  }

  public watcher() {
    return this._elements$
      .pipe(
        filter(val => val.length != 0)
      )
  }

  constructor(private api: ApiClientSerivce) { }
}
