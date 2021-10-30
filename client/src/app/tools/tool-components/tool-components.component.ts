import { Component, Output, EventEmitter } from '@angular/core';
import { HTMLTags } from '@element/models/htmltags';

@Component({
  selector: 'tool-components',
  templateUrl: './tool-components.component.html',
  styleUrls: ['./tool-components.component.css']
})
export class ToolComponentsComponent {
  @Output() handler = new EventEmitter();

  tags = HTMLTags

  onComponentCreate(tag: string) {
    this.handler.emit(tag);
  }
}
