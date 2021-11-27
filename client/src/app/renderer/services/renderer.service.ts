import { Injectable } from "@angular/core";
import { Element } from "@renderer/models/element";
import { settings } from "@renderer/models/settings";
import { BehaviorSubject, Observable } from "rxjs";
import { ApiClientSerivce } from "./api-client.service";

@Injectable({
    providedIn: 'root'
})
export class RendererService {
  private _container$ = new BehaviorSubject(<Element[]>[]);
  public container$: Observable<Element[]>;

  private elementsGet(): Element[] {
    let container: Element[] = [];
    this.api.getElements().subscribe(req => {
      req.forEach(element => {
        if (element != null) {
          if (element.position == undefined)
            element.position = { cellX: 0, cellY: 0, height: 1, width: 1 };
          container.push(element);
        }
      });
    });

    this._container$.next(container)

    return container;
  }

  private configure(): settings {
    const width = window.screen.width;

    if (width < 801)
      // Mobile config
      return {
        mode: 0,

        sideNavMode: 'over',

        pixelType: 'fr',
        pixelSize: 1,

        rows: 20,
        columns: 10,

        lines: true,
        corners: true,
      }
    else
      // Desktop
      return {
        mode: 0,

        sideNavMode: 'side',

        pixelType: 'fr',
        pixelSize: 1,

        rows: 40,
        columns: 60,

        lines: true,
        corners: true,
      }
  }

  constructor(private api: ApiClientSerivce) {
    this.container = this.elementsGet();
    this.settings = this.configure();
    this.container$ = this._container$.asObservable();
  }

  public settings: settings;

  public currentElement?: Element;

  public container: Element[];
}
