import {
  Component, ElementRef, Input,
  EventEmitter, Output,
  QueryList, ViewChild, ViewChildren
} from "@angular/core";
import { Element } from "@renderer/models/element";
import { RendererMode } from "@renderer/models/mode";
import { Settings } from "@renderer/models/settings";
import { HandlerService } from "@handlers/handler.service";
import { GridPropsService } from "./grid.props-service";
import { Size } from "@renderer/models/units";

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
})
export class GridComponent {
  @ViewChild('gird_container') grid_container: ElementRef;
  @ViewChildren('elements_container') elements_container: QueryList<ElementRef>;

  @Input() public settings: Settings;
  @Input() public elements: Element[] | null = [];

  @Output()
  public onInputChangeEmitter = new EventEmitter(true);

  @Input() public set rows(numbers: number) {
    this._rows = [];

    if (numbers > 200)
      numbers = 200;

    for (var i = 0; i < numbers; i++)
      this._rows.push({
        size: this.settings.pixelSize,
        pxType: this.settings.pixelType
      });

    this.onInputChangeEmitter.emit();
  }

  @Input() public set columns(numbers: number) {
    this._columns = [];

    if (numbers > 200)
      numbers = 200;

    for (var i = 0; i < numbers; i++)
      this._columns.push({
        size: this.settings.pixelSize,
        pxType: this.settings.pixelType
      });

    this.onInputChangeEmitter.emit();
  }

  public get rect(): DOMRect {
    return this.grid_container.nativeElement.getBoundingClientRect();
  }

  public _rows: Size[] = [];
  public _columns: Size[] = [];

  public RendererMode = RendererMode;

  constructor(
    public handler: HandlerService,
    public gPropsService: GridPropsService,
  ) {
    this.onInputChangeEmitter.subscribe(() => {
      this.gPropsService.updateGridProps({
        ...this.gPropsService.getValue(),
        rows: this._rows,
        columns: this._columns
      });
    });
  }
}
