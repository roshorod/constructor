import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolHierarchyComponent } from './tool-hierarchy/tool-hierarchy.component';
import { ToolComponentsComponent } from './tool-components/tool-components.component';
import { HTMLTagsPipe } from '../models/htmltags.pipe';
import { ToolPropertiesComponent } from './tool-properties/tool-properties.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTreeModule } from '@angular/material/tree';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    ToolHierarchyComponent,
    ToolComponentsComponent,
    ToolPropertiesComponent,

    HTMLTagsPipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    MatTreeModule,
    ScrollingModule,
    MatIconModule,
    MatButtonModule
  ],
  exports: [
    ToolHierarchyComponent,
    ToolPropertiesComponent,
    ToolComponentsComponent
  ]
})
export class ToolsModule { }
