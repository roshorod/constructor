import { Injectable } from "@angular/core";
import { Element } from "@renderer/models/element";
import { settings } from "@renderer/models/settings";
import { ApiClientSerivce } from "./api-client.service";

@Injectable({
    providedIn: 'root'
})
export class RendererService {

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
    return container;
  }

  constructor(private api: ApiClientSerivce) {
    this.container = this.elementsGet();
  }

  public settings: settings = {
    mode: 0,

    /*
     * Grid Settings
     */
    pixelType: 'fr',
    pixelSize: 1,

    rows: 40,
    columns: 60,

    lines: true,
    corners: true,
  };

  public currentElement?: Element;

  public container: Element[];
}
