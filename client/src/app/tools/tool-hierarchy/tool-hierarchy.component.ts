import { Element } from '@element/models/element';
import { Component, Input, Output, EventEmitter, DoCheck } from '@angular/core';
import { ContainerService } from '@renderer/services/container.service';
import { ElementNode } from './models/element-node';
import { FlatTreeControl } from '@angular/cdk/tree';
import { ElementTreeController } from './models/element-tree-controller';

@Component({
  selector: 'tool-hierarchy',
  templateUrl: './tool-hierarchy.component.html',
  styleUrls: ['./tool-hierarchy.component.css']
})
export class ToolHierarchyComponent implements DoCheck {
  @Input() elements: Element[];
  @Output() onUpdate = new EventEmitter<Element>();

  public _treeControl: FlatTreeControl<ElementNode>;
  public _elemController: ElementTreeController;

  hasChild = (id: number, elem: ElementNode) => {
    return elem.component.instance.child.length != 0 ? true : false;
  };

  constructor(
    public _container: ContainerService,
  ) {
    this._treeControl = new FlatTreeControl<ElementNode>(
      elem => elem.level,
      elem => elem.expandable
    );
    this._elemController = new ElementTreeController(this._treeControl);
  }

  ngDoCheck() {
    this._elemController.nodes = new Array(...this.elements).map(x =>
      new ElementNode(x.tag as string, x.component));
  }

  onComponentSelect(elem: Element) {
    elem.component.instance.select();

    this.onUpdate.emit(elem);
  }

  onWorkspaceLoad() {
  }

  setElementNodeLevel(elem: ElementNode) {
    const styles = {
      'margin-left': elem.level > 1 ?  (elem.level - 1) + 'em' : 0,
    };

    return styles;
  }
}
