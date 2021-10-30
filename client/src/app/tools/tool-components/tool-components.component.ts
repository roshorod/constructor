import { Component, Output, EventEmitter } from '@angular/core';
import { HTMLTags } from '@element/models/htmltags';
import { Action } from '@renderer/models/action';

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
    // this.handler.emit(<Action>{
      // action: 'create',
      // element: { tag: tag, content: 'initial' }
    // });
  }
}
