import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { ElementComponent } from '@element/element.component';
import { ElementDirective } from '@element/element.directive';

import { RendererComponent } from "@renderer/renderer.component";
import { ApiClientSerivce } from "@renderer/services/api-client.service";
import { WorkspaceService } from "@renderer/services/workspace.service";
import { ContainerService } from "@renderer/services/container.service";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    RendererComponent,
    ElementComponent,
    ElementDirective,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule
  ],
  exports: [
    RendererComponent
  ],
  providers: [
    ApiClientSerivce,
    WorkspaceService,
    ContainerService
  ]
})
export class RendererModule { }
