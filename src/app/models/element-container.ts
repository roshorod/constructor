import { ComponentRef } from "@angular/core";
import { ElementComponent } from "../element/element.component";
import { Element } from './element';

export class ElementContainer {
  treeRoot: Element | undefined;

  private createElement(elemRef: ComponentRef<ElementComponent>) {
    return new Element(elemRef);
  }

  insert(elemRef: ComponentRef<ElementComponent>) {
    const elemObj = this.createElement(elemRef);

    if(this.treeRoot == undefined)
      this.treeRoot = elemObj;
    else {
      const traverse = (element: Element) : Element => {
        return element.next == undefined ? element.next = elemObj
          : element.next instanceof Element ? traverse(element.next)
          : element;
      };
      traverse(this.treeRoot);
    }
  }

  getArray() : Element[] {
    let elements: Element[] =[]

    const traverse = (element: Element) => {
      if(element instanceof Element)
        elements.push(element);
      if(element.next != null)
        traverse(element.next);
    };
    traverse(this.treeRoot as Element)

    return elements;
  }
}
