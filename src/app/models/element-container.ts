import { CollectionViewer, DataSource, SelectionChange } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { BehaviorSubject, Observable, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { Element } from './element';

export class ElementContainer {
  treeRoot: Element | undefined;

  public insert(component: Element) {
    const traverse = (element: Element): Element => {
      return element.next == undefined ? element.next = component
        : element.next instanceof Element ? traverse(element.next)
        : element };

    if(!this.treeRoot) {
      this.treeRoot = component;
    }
    else {
      traverse(this.treeRoot);
    }
  }

  public getArray() : Element[] {
    let elements: Element[] = []

    const traverse = (element: Element) => {
      if(element instanceof Element)
        elements.push(element);
      if(element.next != null)
        traverse(element.next);
    };

    if (this.treeRoot)
      traverse(this.treeRoot as Element)

    return elements;
  }
}
