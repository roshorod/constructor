import { Component, Input } from '@angular/core';
import { ElementComponent } from 'src/app/element/element.component';
import { ContainerService } from 'src/app/services/container.service';
import { SpawnPosition, Settings } from '../../models/settings';

@Component({
  selector: 'tool-properties',
  templateUrl: './tool-properties.component.html',
  styleUrls: ['./tool-properties.component.css']
})
export class ToolPropertiesComponent {
  @Input() selected: ElementComponent | undefined;

  spawnPositions = SpawnPosition;

  settings: Settings;

  constructor(
    containerService: ContainerService
  ) {
    this.settings = containerService.settings;
  }
}
