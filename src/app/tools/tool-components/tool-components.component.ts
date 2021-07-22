import { Component, Output, EventEmitter } from '@angular/core';
import { HTMLTags } from 'src/app/models/htmltags';

@Component({
  selector: 'tool-components',
  templateUrl: './tool-components.component.html',
  styleUrls: ['./tool-components.component.css']
})
export class ToolComponentsComponent {
  @Output() onUpdate = new EventEmitter<string>();

  tags = HTMLTags

  onComponentCreate(tag: string) {
    this.onUpdate.emit(tag);
  }
}
