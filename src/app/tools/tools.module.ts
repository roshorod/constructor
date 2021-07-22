import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolHierarchyComponent } from './tool-hierarchy/tool-hierarchy.component';
import { ToolComponentsComponent } from './tool-components/tool-components.component';
import { HTMLTagsPipe } from '../models/htmltags.pipe';


@NgModule({
  declarations: [
    ToolHierarchyComponent,
    ToolComponentsComponent,

    HTMLTagsPipe
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    ToolHierarchyComponent,
    ToolComponentsComponent
  ]
})
export class ToolsModule { }
