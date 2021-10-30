import { AfterContentChecked,
         Component, ViewChild } from '@angular/core';
import { Element } from '@element/models/element';
import { RendererComponent } from '@renderer/renderer.component';
import { ContainerService } from '@renderer/services/container.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterContentChecked {
  @ViewChild(RendererComponent) renderer: RendererComponent;

  elements: Element[] = [];
  selectedElement: Element | undefined;

  constructor(private container: ContainerService) {}

  ngAfterContentChecked() {
    this.elements = this.container.elements.getArray();
  }

  onSelectComponent(element: Element) {
    this.selectedElement = element;
    this.container.selectedElement = element;
  }

}
