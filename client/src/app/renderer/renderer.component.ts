import { Component } from '@angular/core';
import { ApiClientSerivce } from '@renderer/services/api-client.service';
import { Element } from './models/element';
import { RendererService } from './services/renderer.service';
import { settings } from './models/settings';

@Component({
  selector: 'app-renderer',
  templateUrl: './renderer.component.html',
})
export class RendererComponent {
  public container: Element[] = [];
  public settings: settings;

  public elementCreate(element: Element): Element {
    this.api.postElement(element)
      .subscribe((req: {id: string}) => element.id = req.id);

    this.container.push(element);
    return element;
  }

  public elementUpdate(element: Element): Element {
    this.api.postElementById(element).subscribe({
      error: () => {
        console.warn("Server error!");
      }
    });

    return element;
  }

  private elementsGet(): Element[] {
    let container: Element[] = [];

    this.api.getElements().subscribe(req => {
      req.forEach(element => {
        if (element.position == undefined)
          element.position = { cellX: 0, cellY: 0, height: 1, width: 1 };

        container.push(element);
      });
    });
    return container;
  }

  constructor(
    private api: ApiClientSerivce,
    private _settings: RendererService,
  ) {
    this.settings = this._settings.settings;
    this.container = this.elementsGet();
  }
}
