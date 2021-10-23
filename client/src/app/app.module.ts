import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { RendererComponent } from './renderer/renderer.component';
import { ElementComponent } from './element/element.component';
import { ElementDirective } from './element/element.directive';
import { ToolsModule } from './tools/tools.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    AppComponent,
    RendererComponent,
    ElementComponent,
    ElementDirective,
  ],
  imports: [
    BrowserModule,
    ToolsModule,
    BrowserAnimationsModule,
    HttpClientModule,

    MatToolbarModule,
    MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
