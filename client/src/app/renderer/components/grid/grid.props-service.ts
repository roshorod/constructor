import { Injectable } from "@angular/core";
import { Size } from "@renderer/models/units";
import { BehaviorSubject, Observable } from "rxjs";
import { GridProps } from "./grid.props";

@Injectable({
  providedIn: 'root'
})
export class GridPropsService extends BehaviorSubject<GridProps> {
  public readonly gridProps$ = this.asObservable();

  constructor() {
    super({
      rows: <Size[]>[],
      columns: <Size[]>[],
      action: 0,
      mouse: { cellX: 0, cellY: 0 },
      position: { cellX: 0, cellY: 0, width: 0, height: 0 },
      boundWidth: 0,
      boundHeight: 0,
    });
  }

  public updateGridProps(gridProps: GridProps): Observable<GridProps> {
    this.next(gridProps);

    return this.gridProps$;
  }
}
