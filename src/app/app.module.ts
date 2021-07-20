import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent, IterateEnumPipe } from './app.component';
import { RendererComponent } from './renderer/renderer.component';
import { ElementComponent } from './element/element.component';
import { ElementDirective } from './element/element.directive';

@NgModule({
  declarations: [
    AppComponent,
    RendererComponent,
    ElementComponent,
    ElementDirective,

    IterateEnumPipe,
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
