import { ComponentRef } from "@angular/core";
import { ElementComponent } from "../element/element.component";


export class Element {
  next: Element | undefined;
  child: Element[] = [];

  constructor(
    public component: ComponentRef<ElementComponent>,
  ) { }

  addChild(element: Element) {
    this.child.push(element);
  }
}
