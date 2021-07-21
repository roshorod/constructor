import { Component, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { HTMLTags } from './models/HTMLTags';
import { Element } from './models/element';
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
  elements: Element[] = []

  constructor(private builder: BuilderService) { }

  onComponentCreate(tag: string) {
    this.renderer.createElement(tag as HTMLTags);
    this.elements = this.builder.elementContainer.getArray();
  }

  onComponentSelect(element: Element) {
    element.component.instance.select();
  }
}
