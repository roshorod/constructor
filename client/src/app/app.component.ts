import { Component, HostListener, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { RendererComponent } from '@renderer/renderer.component';
import { environment } from '../environments/environment';
import { StoreService } from '@services/store.service';
import { SettingsService } from '@services/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild(RendererComponent) renderer!: RendererComponent;
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

  // @HostListener('window:keyup.e') elementCreate() {
    // this.settings.settings$
      // .subscribe((settings) => settings.mode = 1)
      // .unsubscribe();
  // }

//   @HostListener('window:keyup.s') elementSelect() {
//     this.renderer.settings.mode = 0;
//   }

//   public onElementMove() {
//     this.renderer.settings.mode = 0;
//   }

//   public onElementResize() {
//     this.renderer.settings.mode = 2;
  // }
//
//   public onElementCreate() {
//     this.store.create({
//       content: "Initial text",
//       position: { cellX: 0, cellY: 0, width: 5, height: 5 }
//     }).subscribe(console.log);
}
