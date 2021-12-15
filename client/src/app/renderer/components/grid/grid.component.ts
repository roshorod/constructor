import {
  Component, ElementRef, Input,
  QueryList, ViewChild, ViewChildren
} from "@angular/core";
import { Element, ElementAction } from "@renderer/models/element";
import { getCell } from "@renderer/models/units.utils";
import { RendererMode } from "@renderer/models/mode";
import { Settings } from "@renderer/models/settings";
import { getElementAction } from "@renderer/models/element.utils";
import { StoreService } from "@services/store.service";
import { HandlerService } from "./handlers/handler.service";
import { GridProps } from "./props";

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
  providers: [HandlerService]
})
export class GridComponent {
  @ViewChild('gird_container') grid_container: ElementRef;
  @ViewChildren('elements_container') elements_container: QueryList<ElementRef>;

  @Input() public settings: Settings;
  @Input() public elements: Element[] | null = [];

  @Input() public set rows(numbers: number) {
    this.gridProps.rows = [];

    if (numbers > 200)
      numbers = 199;

    for (var i = 0; i < numbers; i++) {
      this.gridProps.rows.push(
        { size: this.settings.pixelSize, pxType: this.settings.pixelType }
      );
    }
  }

  public get rows(): number {
    return this.gridProps.rows.length;
  }

  @Input() public set columns(numbers: number) {
    this.gridProps.columns = [];

    if (numbers > 200)
      numbers = 199;

    for (var i = 0; i < numbers; i++) {
      this.gridProps.columns.push(
        { size: this.settings.pixelSize, pxType: this.settings.pixelType }
      );
    }
  }

  public get columns(): number {
    return this.gridProps.columns.length;
  }

  public offset = 5;

  public gridProps: GridProps = {
    rows: [],
    columns: [],

    action: 0,
    mouse: { cellX: 0, cellY: 0 },
    position: { cellX: 0, cellY: 0, width: 0, height: 0},

    boundWidth: 0,
    boundHeight: 0,
  };

  public RendererMode = RendererMode;

  private lastElementIndex?: number;

  constructor(
    private store: StoreService,
    public handler: HandlerService,
  ) { }

  public get rect(): DOMRect {
    return this.grid_container.nativeElement.getBoundingClientRect();
  }

  private selectBorder(index: number) {
    if (this.lastElementIndex || this.lastElementIndex === 0)
      this.elements_container
        .get(this.lastElementIndex)?.nativeElement.classList.remove('element-select');

    if (this.settings.corners) {
      this.lastElementIndex = index;
      this.elements_container.get(index)?.nativeElement.classList.add('element-select');
    }
  }

  public registerHandlers(
    event: MouseEvent | TouchEvent,
    element: Element,
    index: number
  ) {

    const handlers = { ...this.handler };

    let action = 0;
    let x: number = 0;
    let y: number = 0;

    if (event instanceof MouseEvent) {
      action = getElementAction(event, element, this.offset);

      x = event.clientX;
      y = event.clientY;

    } else if (event instanceof TouchEvent) {

      x = event.touches[0].clientX;
      y = event.touches[0].clientY;

      action = 1;
    }

    const cell = getCell(
      {
        x: x,
        y: y
      },
      {
        rect: this.rect,
        rows: this.gridProps.rows,
        columns: this.gridProps.columns
      });

    this.selectBorder(index);
    this.store.select(element);

    switch (this.settings.mode) {
      case RendererMode.select: {
        if (
          action > ElementAction.none &&
          action > ElementAction.move
        ) {

          this.store.updateGridProps({
            ...this.gridProps,
            mouse: cell,
            action,
            rect: this.rect
          });

          document.addEventListener(
            handlers.onResize.type,
            handlers.onResize.callback,
            true
          );

          document.addEventListener(
            handlers.onEnd.type,
            handlers.onEnd.callback,
            true
          );
        } else {
          const boundWidth = this.columns - element.position.width;
          const boundHeight = this.rows - element.position.height;

          this.store.updateGridProps({
            ...this.gridProps,
            mouse: cell,
            action,
            position: element.position,
            boundWidth,
            boundHeight,
            rect: this.rect
          });

          document.addEventListener(
            handlers.onMove.type,
            handlers.onMove.callback,
            true
          );

          document.addEventListener(
            handlers.onEnd.type,
            handlers.onEnd.callback,
            true
          );
        }

        break;
      }
      case RendererMode.resize: {
        this.store.updateGridProps({
          ...this.gridProps,
          mouse: cell,
          action,
          position: element.position,
          rect: this.rect
        });

        document.addEventListener(
          handlers.onResize.type,
          handlers.onResize.callback,
          true
        );

        document.addEventListener(
          handlers.onEnd.type,
          handlers.onEnd.callback,
          true
        );

        break;
      }
    }
  }

  public onElementCreate(event: MouseEvent) {
    const cell = getCell(
      {
        x: event.clientX,
        y: event.clientY
      },
      {
        rect: this.rect,
        rows: this.gridProps.rows,
        columns: this.gridProps.columns
      });

    const signature: Element = {
      content: "Initial text",
      position: { ...cell, width: 5, height: 5 },
      resizeTop: true,
      resizeLeft: true,
      resizeRight: true,
      resizeBottom: true
    };

    this.store.create(signature).subscribe((element) => {
      this.store.select(element);
    });

    this.settings.mode = this.RendererMode.select;
  }
}
