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
    this.api.postElement(element).subscribe(
      (req: { id: string }) => element.id = req.id);

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

  constructor(
    private api: ApiClientSerivce,
    private rendererService: RendererService,
  ) {
    this.settings = this.rendererService.settings;
    this.container = this.rendererService.container;
  }
}
