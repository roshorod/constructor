import { Element } from '../../models/element';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { WorkspaceService } from 'src/app/services/workspace.service';

@Component({
  selector: 'tool-hierarchy',
  templateUrl: './tool-hierarchy.component.html',
  styleUrls: ['./tool-hierarchy.component.css']
})
export class ToolHierarchyComponent {
  @Input() elements: Element[] | undefined;
  @Output() onUpdate = new EventEmitter();

  constructor(
    private workspace: WorkspaceService
  ) { }

  onComponentSelect(elem: Element) {
    elem.component.instance.select();
    this.onUpdate.emit();
  }

  onWorkspaceLoad() {
    this.workspace.loadProjectOnScreen(this.elements as Element[]);
  }
}
