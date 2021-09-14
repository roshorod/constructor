import { Injectable } from '@angular/core';
import { Element } from '../models/element';
import { ElementContainer } from '../models/element-container';

@Injectable({
  providedIn: 'root'
})
export class ContainerService {
  elements: ElementContainer;

  selectedElement: Element;

  constructor() {
    this.elements = new ElementContainer();
  }
}
