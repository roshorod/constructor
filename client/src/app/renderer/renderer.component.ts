import { Component, Inject, ViewChild } from '@angular/core';
import { Settings } from './models/settings';
import { StoreService } from '@services/store.service';
import { SettingsService } from '@services/settings.service';
import { CONFIG } from '@services/settings.config';
import { WebSocketService } from '@websocket/websocket.service';
import { HandlerService } from '@handlers/handler.service';
import { GridComponent } from './components/grid/grid.component';

@Component({
  selector: 'app-renderer',
  templateUrl: './renderer.component.html',
})
export class RendererComponent {
  @ViewChild(GridComponent) grid!: GridComponent;

  constructor(
    public store: StoreService,
    public handler: HandlerService,
    public settings: SettingsService,
    public websocket: WebSocketService,
    /*
     * Set config when settings.settings$ == null
     */
    @Inject(CONFIG) public defaultConfig: Settings
  ) { }
}
