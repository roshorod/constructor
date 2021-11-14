import { Component,  AfterViewInit, OnInit } from '@angular/core';
import { ApiClientSerivce } from '@renderer/services/api-client.service';
import { Element } from './models/element';
import { SnackBarService } from '@services/snack-bar.service';
import { RendererService } from './services/renderer.service';
import { settings } from './models/settings';

@Component({
  selector: 'app-renderer',
  templateUrl: './renderer.component.html',
})
export class RendererComponent implements AfterViewInit, OnInit {
  public container: Element[] = [];
  public settings: settings;

  public elementCreate(element: Element): Element {
    this.api.postElement(element).subscribe(
      (req: string[]) => {
        for (const val in req)
          if (val === 'id')
            element.id = req[val];

        this.container.push(element);

      });
    return element;
  }

  public elementUpdate(element: Element): Element {
    this.api.postElementById(element).subscribe({
      complete: () => {
        this.snack.open("Saved!");
      },
      error: () => {
        this.snack.open("Server error!");
        console.warn("Server error!");
      }
    });

    return element;
  }

  private elementsGet(): Element[] {
    this.api.getElements().subscribe(req => {
      req.forEach(element => {
        if (element.position == undefined)
          element.position = { cellX: 0, cellY: 0, height: 1, width: 1 };

        this.container.push(element);
      });
    });

    return this.container;
  }

  constructor(
    private api: ApiClientSerivce,
    private snack: SnackBarService,
    private _settings: RendererService,
  ) { }

  ngOnInit() {
    this.settings = this._settings.settings;
  }

  ngAfterViewInit() {
    this.elementsGet();
  }
}
