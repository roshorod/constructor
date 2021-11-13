import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { RendererComponent } from "@renderer/renderer.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { GridComponent } from "./components/grid/grid.component";
import { SafeStylePipe } from "./components/grid/pipes/safe-style.pipe";
import { GridAreaPipe } from "./components/grid/pipes/grid-area.pipe";

@NgModule({
  declarations: [
    RendererComponent,
    GridComponent,
    SafeStylePipe,
    GridAreaPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule
  ],
  exports: [
    RendererComponent
  ]
})
export class RendererModule { }
