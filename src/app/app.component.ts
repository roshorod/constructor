import { Component, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { HTMLTags } from './models/HTMLTags';
import { Element } from './models/element';
import { RendererComponent } from './renderer/renderer.component';
import { ContainerService } from './services/container.service';
import { WorkspaceService } from './services/workspace.service';

@Pipe({
  name: 'iterateEnum'
})
export class IterateEnumPipe implements PipeTransform {
  transform(data: Object) {
    const keys = Object.keys(data);
    return keys;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild(RendererComponent) renderer!: RendererComponent;
  htmlTags = HTMLTags;
  elements: Element[] = []

  constructor(
    private container: ContainerService,
    private workspace: WorkspaceService,
  ) { }

  onComponentCreate(tag: string) {
    this.renderer.createElement(tag as HTMLTags);
    this.elements = this.container.elementContainer.getArray();
  }

  onComponentSelect(element: Element) {
    element.component.instance.select();
  }

  onWorkspaceLoad() {
    this.workspace.loadProjectOnScreen(this.elements);
  }
}
