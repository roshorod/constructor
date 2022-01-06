import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

import { RendererModule } from '@renderer/renderer.module';
import { InspectorModule } from '@inspector/inspector.component';
import { WebSocketModule } from '@websocket/websocket.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RendererModule,
    InspectorModule,

    WebSocketModule.configure({
      url: 'ws://0.0.0.0:10000/api/element',
      reconnectInterval: 10000,
      recoonectAttempts: 3
    }),

    HttpClientModule,

    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
