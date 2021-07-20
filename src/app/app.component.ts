import { Component, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { Item } from './models/container';
import { HTMLTags } from './models/HTMLTags';
import { RendererComponent } from './renderer/renderer.component';
import { BuilderService } from './services/builder.service';


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
  elements: Item[] = []

  constructor(private builder: BuilderService) { }

  onComponentCreate(tag: string) {
    this.renderer.createElement(tag as HTMLTags);
    this.elements = this.builder.container.getItems();
  }

  onComponentSelect(element: Item) {
    element.element.instance.select();
  }
}
