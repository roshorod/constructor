import { Injectable } from '@angular/core';
import { Element } from '@element/models/element';
import { ElementContainer } from '@renderer/models/element-container';
import { RendererModule } from '@renderer/renderer.module';

@Injectable()
export class ContainerService {
  elements: ElementContainer;

  selectedElement: Element;

  constructor() {
    this.elements = new ElementContainer();
  }
}
