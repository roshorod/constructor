import { Element } from '../../models/element';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { ContainerService } from 'src/app/services/container.service';

@Component({
  selector: 'tool-hierarchy',
  templateUrl: './tool-hierarchy.component.html',
  styleUrls: ['./tool-hierarchy.component.css']
})
export class ToolHierarchyComponent {
  @Input() elements: Element[];
  @Output() onUpdate = new EventEmitter();

  constructor(
    private workspace: WorkspaceService,
    private container: ContainerService,
  ) { }

  onComponentSelect(elem: Element) {
    console.log(elem)
    elem.component.instance.select();
    this.container.selectedElement = elem;
    this.onUpdate.emit();
  }

  onWorkspaceLoad() {
    this.workspace.loadProjectOnScreen(this.elements as Element[]);
  }
}
