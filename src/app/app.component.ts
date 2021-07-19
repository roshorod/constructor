import { Component, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { HTMLTags } from './models/HTMLTags';
import { RendererComponent } from './renderer/renderer.component';

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

  onComponentCreate(tag: string) {
    this.renderer.createElement(tag as HTMLTags);
  }
}
