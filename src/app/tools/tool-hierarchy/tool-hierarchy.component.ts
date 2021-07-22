import { Element } from '../../models/element';
import { Component, Input, OnInit } from '@angular/core';
import { WorkspaceService } from 'src/app/services/workspace.service';

@Component({
  selector: 'tool-hierarchy',
  templateUrl: './tool-hierarchy.component.html',
  styleUrls: ['./tool-hierarchy.component.css']
})
export class ToolHierarchyComponent {
  @Input() elements: Element[] | undefined;

  constructor(
    private workspace: WorkspaceService
  ) { }

  onComponentSelect(elem: Element) {
    elem.component.instance.select();
  }

  onWorkspaceLoad() {
    this.workspace.loadProjectOnScreen(this.elements as Element[]);
  }
}
