import { ComponentRef } from "@angular/core";
import { ElementComponent } from '@element/element.component'
import { SpawnPosition } from "./spawn-positions";
import { HTMLTags } from "./htmltags";

export abstract class Element {
  constructor(
    public tag: HTMLTags,
    public content: string,
    public position: SpawnPosition = SpawnPosition.center,
    public id: string = '',
  ) { }

  cords: {x: number, y: number};
  color: string = "#000000";

  component: ComponentRef<ElementComponent>;

  next: Element | undefined;

  child: Element[] = [];
}
