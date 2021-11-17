import { Component, Input } from "@angular/core";

@Component({
  selector: 'properties',
  template: `
    <mat-expansion-panel class="bg2 fg" [expanded]="expanded">
      <mat-expansion-panel-header>
        <mat-panel-title class="fg">
          {{ title }}
        </mat-panel-title>
      </mat-expansion-panel-header>
      <ng-template matExpansionPanelContent>
        <ng-content></ng-content>
      </ng-template>
    </mat-expansion-panel>`,
    styles: [`mat-panel-title { user-select: none; }
              mat-expansion-panel { margin: 0 10px 10px 10px; }`]
})
export class PropertiesComponent {
  @Input() title: string;
  @Input() expanded: string;
}
