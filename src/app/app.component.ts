import { Component, ViewChild } from '@angular/core';
import { ElementComponent } from './element/element.component';
import { Element } from './models/element';
import { HTMLTags } from './models/htmltags';
import { RendererComponent } from './renderer/renderer.component';
import { ContainerService } from './services/container.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild(RendererComponent) renderer!: RendererComponent;

  elements: Element[] = []
  selectedElement: ElementComponent | undefined;

  constructor(
    private container: ContainerService,
  ) { }

  onComponentCreate(tag: string) {
    this.renderer.createElement(tag as HTMLTags);
    this.elements = this.container.elementContainer.getArray();
    console.log(this.container.settings);
  }

  onPropertiesUpdate() {
    this.selectedElement = this.container.selectedComponent;
    console.log(this.selectedElement);
  }
}
