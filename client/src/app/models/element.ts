import { ComponentRef } from "@angular/core";
import { ElementComponent } from "../element/element.component";
import { HTMLTags } from "./htmltags";
import { SpawnPosition } from "./settings";

export abstract class Element {
  constructor(
    public tag: HTMLTags,
    public content: string,
    public position: SpawnPosition = SpawnPosition.center,
  ) { }

  component: ComponentRef<ElementComponent>;

  next: Element | undefined;

  child: Element[] = [];
}
