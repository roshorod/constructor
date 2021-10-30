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

  onComponentCreate(tag: string) {
    this.renderer.elementCreate(tag);
  }

  onSelectedComponentPost(id: string) {
    if(this.selectedElement)
      if(this.selectedElement.id === id)
        this.renderer.elementUpdate(this.selectedElement);
  }

  onSelectComponent(element: Element) {
    this.renderer.elementSelect(element);
    this.selectedElement = element;
  }

  onUpdatePosition(element: Element) {
    this.renderer.updateElementPosition(element);
  }
}
