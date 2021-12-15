import { Component, HostListener, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { environment } from '../environments/environment';
import { StoreService } from '@services/store.service';
import { SettingsService } from '@services/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  public env = environment;

  constructor(
    public store: StoreService,
    public settings: SettingsService
  ) { }

  @HostListener('window:keyup.esc') closeSidenav() {
    this.sidenav.close();
  }

  @HostListener('window:keyup.o') openSidenav() {
    this.sidenav.open();
  }

  public onElementMove() {
    const settings = {
      ...this.settings.getValue(),
      mode: 0
    };
    this.settings.next(settings);
  }

  public onElementResize() {
    const settings = {
      ...this.settings.getValue(),
      mode: 2
    };
    this.settings.next(settings);
  }

  public onElementCreate() {
    this.store.create({
      content: "Initial text",
      resizeTop: true,
      resizeLeft: true,
      resizeRight: true,
      resizeBottom: true,
      position: { cellX: 0, cellY: 0, width: 5, height: 5 }
    }).subscribe();
  }
}
