import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { RendererComponent } from "@renderer/renderer.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { ElementComponent } from "./components/element/element.component";
import { GridComponent } from "./components/grid/grid.component";

import { SizePipe } from "./pipes/size.pipe";
import { GridAreaPipe } from "./pipes/grid-area.pipe";
import { DefaultPipe } from "./pipes/default.pipe";


@NgModule({
  declarations: [
    RendererComponent,
    ElementComponent,
    GridComponent,
    SizePipe,
    GridAreaPipe,
    DefaultPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule
  ],
  exports: [
    RendererComponent,
    DefaultPipe
  ]
})
export class RendererModule { }
