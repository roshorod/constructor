import { ComponentRef } from "@angular/core";
import { ElementComponent } from "src/app/element/element.component";
import { Element } from "../../../models/element";

export class ElementNode {
  constructor(
    public name: string,
    public component: ComponentRef<ElementComponent>,

    public level = 1,
    public expandable = false,
    public isLoading = false,
  ) { }
}
