import { Injectable } from '@angular/core';
import { ElementContainer } from '../models/element-container';


@Injectable({
  providedIn: 'root'
})
export class ContainerService {
  elementContainer: ElementContainer;

  constructor() {
    this.elementContainer = new ElementContainer();
  }
}
