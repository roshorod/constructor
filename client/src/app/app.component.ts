import { AfterViewChecked, Component, ViewChild } from '@angular/core';
import { Element } from './models/element';
import { HTMLTags } from './models/htmltags';
import { RendererComponent } from './renderer/renderer.component';
import { ApiClientSerivce } from './services/api-client.service';
import { ContainerService } from './services/container.service';
import { CookiesService } from './services/cookie.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewChecked{
  @ViewChild(RendererComponent) renderer!: RendererComponent;

  elements: Element[] = [];
  selectedElement: Element | undefined;

  constructor(
    private container: ContainerService,
    private api: ApiClientSerivce,
    private cookie: CookiesService
  ) { }

  ngAfterViewChecked() {
    this.elements = this.container.elements.getArray();
  }

  onComponentCreate(tag: string) {
    this.api.postElement(tag).subscribe(
      () => {
        this.renderer.createElement(tag as HTMLTags);
        this.elements = this.container.elements.getArray();
        console.log(this.cookie.getCookie(this.cookie.cookieName))
      },
      () => { console.error("Cannot create element") });
  }

  onSelectedUpdate() {
    this.selectedElement = this.container.selectedElement;
  }

  onUpdatePosition() {
    if (this.container.selectedElement)
      this.renderer.updateElementPosition(this.container.selectedElement);
  }
}
