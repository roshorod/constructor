import { AfterContentChecked, Component, ViewChild } from '@angular/core';
import { Element } from './models/element';
import { HTMLTags } from './models/htmltags';
import { RendererComponent } from './renderer/renderer.component';
import { ApiClientSerivce } from './services/api-client.service';
import { ContainerService } from './services/container.service';
import { SnackBarService } from './services/snack-bar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterContentChecked {
  @ViewChild(RendererComponent) renderer!: RendererComponent;

  elements: Element[] = [];
  selectedElement: Element | undefined;

  constructor(
    private container: ContainerService,
    private api: ApiClientSerivce,
    private snack: SnackBarService
  ) { }

  ngAfterContentChecked() {
    this.elements = this.container.elements.getArray();
  }

  onComponentCreate(tag: string) {
    this.api.postElement(tag).subscribe((resp: string[]) => {
      var elemId = '';

      for (const val in resp)
        if (val === 'id')
          elemId = resp[val]

      this.renderer.createElement(tag as HTMLTags, elemId);
      this.elements = this.container.elements.getArray();
      this.snack.open("Saved!");
      },
      () => { console.error("Cannot create element") });
  }

  onSelectedComponentPost(id: string) {
    if (this.selectedElement) {
      const component = this.selectedElement.component.instance;
      console.log(component)
      if (component.id === id) {
        this.api.postElementById(this.selectedElement).subscribe();
        this.snack.open("Saved!");
      } else
        console.warn("Selected element id conflict");
    } else
      console.warn("Selected element undefined");
  }

  onSelectComponent() {
    this.selectedElement = this.container.selectedElement;
  }

  onUpdatePosition() {
    if (this.container.selectedElement)
      this.renderer.updateElementPosition(this.container.selectedElement);
  }
}
