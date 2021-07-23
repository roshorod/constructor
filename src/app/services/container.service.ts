import { Injectable } from '@angular/core';
import { Settings, SpawnPosition } from '../models/settings';
import { ElementContainer } from '../models/element-container';
import { ElementComponent } from '../element/element.component';


@Injectable({
  providedIn: 'root'
})
export class ContainerService {
  elementContainer: ElementContainer;

  settings: Settings = {
    spawnPosition: SpawnPosition.center,
  };

  selectedComponent: ElementComponent | undefined;

  constructor() {
    this.elementContainer = new ElementContainer();
  }
}
