import { Element } from '../../models/element';
import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { ContainerService } from 'src/app/services/container.service';
import { ElementNode } from './models/element-node';
import { FlatTreeControl } from '@angular/cdk/tree';
import { ElementTreeController } from './models/element-tree-controller';

@Component({
  selector: 'tool-hierarchy',
  templateUrl: './tool-hierarchy.component.html',
  styleUrls: ['./tool-hierarchy.component.css']
})
export class ToolHierarchyComponent implements OnChanges {
  @Input() elements: Element[];
  @Output() onUpdate = new EventEmitter();

  public _treeControl: FlatTreeControl<ElementNode>;
  public _elemController: ElementTreeController;

  hasChild = (id: number, elem: ElementNode) => {
    return elem.component.instance.child.length != 0 ? true : false;
  };

  constructor(
    private workspace: WorkspaceService,
    public _container: ContainerService,
  ) {
    this._treeControl = new FlatTreeControl<ElementNode>(
      elem => elem.level,
      elem => elem.expandable
    );
    this._elemController = new ElementTreeController(this._treeControl);
  }

  ngOnChanges() {
    this._elemController.nodes = new Array(...this.elements).map(x =>
      new ElementNode(x.tag as string, x.component));
  }

  onComponentSelect(elem: Element) {
    elem.component.instance.select();
    this._container.selectedElement = elem;
    this.onUpdate.emit();
  }

  onWorkspaceLoad() {
    this.workspace.loadProjectOnScreen(this.elements as Element[]);
  }

  setElementNodeLevel(elem: ElementNode) {
    const styles = {
      'margin-left': elem.level > 1 ?  (elem.level - 1) + 'em' : 0,
    };

    return styles;
  }
}
