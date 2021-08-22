import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Element } from '../../models/element';
import { SpawnPosition } from '../../models/settings';

@Component({
  selector: 'tool-properties',
  templateUrl: './tool-properties.component.html',
  styleUrls: ['./tool-properties.component.css']
})
export class ToolPropertiesComponent {
  @Input() selected: Element | undefined;
  @Output() onUpdatePos = new EventEmitter<SpawnPosition>();

  spawnPositions = SpawnPosition;

  onUpdateContent() {
    if (this.selected) {
      this.selected.component.instance.update();
    }
  }

  onUpdatePosition() {
    this.onUpdatePos.emit();
  }
}
