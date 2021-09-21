import { CollectionViewer, DataSource, SelectionChange } from "@angular/cdk/collections";
import { FlatTreeControl } from "@angular/cdk/tree";
import { BehaviorSubject, Observable, merge } from "rxjs";
import { map } from "rxjs/operators";
import { ElementNode } from "./element-node";

export class ElementTreeController implements DataSource<ElementNode> {
  nodesBehavior = new BehaviorSubject<ElementNode[]>([]);

  constructor(
    private _treeContol: FlatTreeControl<ElementNode>,
  ) { }

  get nodes(): ElementNode[] {
    return this.nodesBehavior.value;
  }

  set nodes(nodes: ElementNode[]) {
    this._treeContol.dataNodes = nodes;
    this.nodesBehavior.next(nodes);
  }

  connect(collectionViewer: CollectionViewer) : Observable<ElementNode[]>{
    this._treeContol.expansionModel.changed.subscribe(state => {
      if (
        (state as SelectionChange<ElementNode>).added ||
          (state as SelectionChange<ElementNode>).removed
      ) {
        this.treeContorlHandler(state);
      }
    });

    return merge(collectionViewer.viewChange, this.nodesBehavior).pipe(
      map(() => this.nodes)
    );
  }

  disconnect(collectionViewr: CollectionViewer) : void {
  }

  treeContorlHandler(state: SelectionChange<ElementNode>){
    if (state.added) {
      state.added.forEach(node => this.toggleNode(node, true));
    }
    if (state.removed) {
      state.removed
        .slice()
        .reverse()
        .forEach(node => this.toggleNode(node, false));
    }
  }

  private toggleNode(node: ElementNode, expand: boolean) {
    const index = this.nodes.indexOf(node);
    node.isLoading = true;
    setTimeout(() => {
      if (expand) {
        const nodes = node.component.instance.child.map(
          child =>
            new ElementNode(child.tag as string,
                            child.component,
                            node.level + 1,
                            child.child.length ? true : false)
        );
        this.nodes.splice(index + 1, 0, ...nodes);
      } else {
        let count = 0;
        for (let i = index + 1;
             i < this.nodes.length && this.nodes[i].level > node.level;
             i++, count++) { }
        this.nodes.splice(index + 1, count);
      }
      this.nodesBehavior.next(this.nodes);
      node.isLoading = false;
    }, 100);
  }
}
