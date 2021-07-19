import { ComponentRef } from "@angular/core";
import { ElementComponent } from "../element/element.component";

export class Item {
  constructor (
    public element: ComponentRef<ElementComponent>,
    public next: null | Item,
    public child: null | Item[]
  ) { }

  public insert (item: Item) {
    if (this.child instanceof Item)
      this.child.push(item)
  }
}

export class Container {
  private root: Item | undefined;

  private createItem (element: ComponentRef<ElementComponent>) : Item {
    const item = new Item(element, null, null);
    return item;
  }

  addItem(element: ComponentRef<ElementComponent>) {
    const item = this.createItem(element);

    if (this.root == undefined)
      this.root = item;
    else
    {
      const traverse = (root: Item): Item => {
        return root.next == null ? root.next = item
          : root.next instanceof Item ? traverse(root.next)
          : root
      };

      traverse(this.root)
    }
  }

  getItems() : Item | undefined {
    return this.root instanceof Item ? this.root
      : undefined;
  }
}