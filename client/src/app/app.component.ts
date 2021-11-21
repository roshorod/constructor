import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { RendererComponent } from '@renderer/renderer.component';
import { RendererService } from '@renderer/services/renderer.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements AfterViewInit {
  @ViewChild(RendererComponent) renderer!: RendererComponent;
  @ViewChild('sidenav') sidenav!: MatSidenav;

  public sidenavMode = () => {
    const width = window.screen.width;

    if (width < 801)
      this.sidenav.mode = 'over';
    else
      this.sidenav.mode = 'side';
  };

  public env = environment;

  constructor(public rendererService: RendererService,
              private cdRef: ChangeDetectorRef) { }

  ngAfterViewInit() {
    this.sidenavMode();
    this.cdRef.detectChanges();
  }

  @HostListener('window:keyup.esc') closeSidenav() {
    this.sidenav.close();
  }

  @HostListener('window:keyup.o') openSidenav() {
    this.sidenav.open();
  }

  @HostListener('window:keyup.e') elementCreate() {
    this.renderer.settings.mode = 1;
  }

  @HostListener('window:keyup.s') elementSelect() {
    this.renderer.settings.mode = 0;
  }

  public onElementCreate() {
    this.renderer.elementCreate({
      content: "Initial text",
      position: { cellX: 0, cellY: 0, width: 5, height: 5 }
    });
  }
}
