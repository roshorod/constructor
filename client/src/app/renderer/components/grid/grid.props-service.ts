import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { GridProps } from "./grid.props";

@Injectable({
  providedIn: 'root'
})
export class GridPropsService {
  private _gridProps$ = new Subject<GridProps>();
  public readonly gridProps$ = this._gridProps$.asObservable();

  public updateGridProps(gridProps: GridProps): Observable<GridProps> {
    this._gridProps$.next(gridProps);

    return this.gridProps$;
  }
}
