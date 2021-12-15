import { AfterViewInit, Component, Inject } from '@angular/core';
import { Settings } from './models/settings';
import { StoreService } from '@services/store.service';
import { SettingsService } from '@services/settings.service';
import { CONFIG } from '@services/settings.config';

@Component({
  selector: 'app-renderer',
  templateUrl: './renderer.component.html',
})
export class RendererComponent implements AfterViewInit {
  constructor(
    public store: StoreService,
    public settings: SettingsService,
    /*
     * Set config when settings.settings$ == null
     */
    @Inject(CONFIG) public defaultConfig: Settings
  ) { }

  ngAfterViewInit() {
    this.store.watcher().subscribe();
    this.store.fetch().subscribe();
  }
}
