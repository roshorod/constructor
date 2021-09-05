import { Component, ViewChild } from '@angular/core';
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
  selectedElement: Element | undefined;

  constructor(
    private container: ContainerService,
  ) { }

  onComponentCreate(tag: string) {
    this.renderer.createElement(tag as HTMLTags);
    this.elements = this.container.elements.getArray();
  }

  onSelectedUpdate() {
    this.selectedElement = this.container.selectedElement;
  }

  onUpdatePosition() {
    if (this.container.selectedElement)
      this.renderer.updateElementPosition(this.container.selectedElement);
  }
}
