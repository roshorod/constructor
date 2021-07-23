import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolHierarchyComponent } from './tool-hierarchy/tool-hierarchy.component';
import { ToolComponentsComponent } from './tool-components/tool-components.component';
import { HTMLTagsPipe } from '../models/htmltags.pipe';
import { ToolPropertiesComponent } from './tool-properties/tool-properties.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ToolHierarchyComponent,
    ToolComponentsComponent,
    ToolPropertiesComponent,

    HTMLTagsPipe,
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    ToolHierarchyComponent,
    ToolPropertiesComponent,
    ToolComponentsComponent
  ]
})
export class ToolsModule { }
