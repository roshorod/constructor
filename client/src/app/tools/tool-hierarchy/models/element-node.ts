import { ComponentRef } from "@angular/core";
import { ElementComponent } from "@element/element.component";

export class ElementNode {
  constructor(
    public name: string,
    public component: ComponentRef<ElementComponent>,

    public level = 1,
    public expandable = false,
    public isLoading = false,
  ) { }
}
