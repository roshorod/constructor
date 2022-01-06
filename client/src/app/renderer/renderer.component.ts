import { Component, Inject } from '@angular/core';
import { Settings } from './models/settings';
import { StoreService } from '@services/store.service';
import { SettingsService } from '@services/settings.service';
import { CONFIG } from '@services/settings.config';
import { WebSocketService } from '@websocket/websocket.service';

@Component({
  selector: 'app-renderer',
  templateUrl: './renderer.component.html',
})
export class RendererComponent {
  constructor(
    public store: StoreService,
    public settings: SettingsService,
    public websocket: WebSocketService,
    /*
     * Set config when settings.settings$ == null
     */
    @Inject(CONFIG) public defaultConfig: Settings
  ) { }
}
