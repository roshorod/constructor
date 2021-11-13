import { Component, Input } from "@angular/core";

@Component({
  selector: 'properties',
  template: `
    <mat-expansion-panel> 
      <mat-expansion-panel-header>
        <mat-panel-title>
          {{ title }}
        </mat-panel-title>
      </mat-expansion-panel-header>
      <ng-template matExpansionPanelContent>
        <ng-content></ng-content>
      </ng-template>
    </mat-expansion-panel>`,
    styles: ['mat-panel-title { user-select: none;}']
})
export class PropertiesComponent {
  @Input() title: string;
}