import { Component, ElementRef, Input, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { getElementAction } from "@renderer/models/element.utils";
import { Element, ElementAction } from "@renderer/models/element";
import { getCell } from "@renderer/models/units.utils";
import { Cell, Size, Position } from "@renderer/models/units";
import { RendererService } from "@renderer/services/renderer.service";
import { ApiClientSerivce } from "@renderer/services/api-client.service";
import { RendererComponent } from "@renderer/renderer.component";
import { RendererMode } from "@renderer/models/mode";
import { settings } from "@renderer/models/settings";

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent {
  @ViewChild('gird_container') grid_container: ElementRef;
  @ViewChildren('elements_container') elements_container: QueryList<ElementRef>;

  @Input() public settings: settings;
  @Input() public elements: Element[] = [];

  public rowsType: Size[] = [];
  @Input() public set rows(numbers: number) {
    this.rowsType = [];

    //Tested on 1000 rows and columns with grid lines and it's crash the app
    // May be allow without grid lines?
    if (numbers > 200)
      numbers = 199;

    for (var i = 0; i < numbers; i++) {
      this.rowsType.push(
        { size: this.settings.pixelSize, pxType: this.settings.pixelType }
      );
    }
  }

  public columnsType: Size[] = [];
  @Input() public set columns(numbers: number) {
    this.columnsType = [];

    if (numbers > 200)
      numbers = 199;

    for (var i = 0; i < numbers; i++) {
      this.columnsType.push(
        { size: this.settings.pixelSize, pxType: this.settings.pixelType }
      );
    }
  }

  public cursor: string = 'default';
  public RendererMode = RendererMode;

  private mouseOffset: number = 5;
  private savedMousePosition: Cell;
  private savedElementPosition: Position;

  private currentElement?: Element;
  /*
   * Used for border around element.
   */
  private lastElementIndex?: number;

  private elementAction = ElementAction.none;

  constructor(
    public rendererService: RendererService,
    private api: ApiClientSerivce,
    private renderer: RendererComponent
  ) { }

  private get rect(): DOMRect {
    return this.grid_container.nativeElement.getBoundingClientRect();
  }

  public onMouseMove(event: MouseEvent, element: Element) {
    if (this.settings.mode == 0)
      switch (getElementAction(event, element, this.mouseOffset)) {
        case ElementAction.left_top: this.cursor = 'se-resize'; break;
        case ElementAction.left_bottom: this.cursor = 'ne-resize'; break;
        case ElementAction.right_top: this.cursor = 'ne-resize'; break;
        case ElementAction.right_bottom: this.cursor = 'se-resize'; break;
        case ElementAction.top:
        case ElementAction.bottom: this.cursor = 'ns-resize'; break;
        case ElementAction.left:
        case ElementAction.right: this.cursor = 'w-resize'; break;
        case ElementAction.move: this.cursor = 'move'; break;
        case ElementAction.none: this.cursor = 'default'; break;
      }
  }

  /*
   * The function make real magic.
   * First of all, I get position of current cell(mouse click) then calc rect of element
   * After that i check which action i need to do,
   * the next step i set cord for elemen bound with cortege.
   */
  private elementOnResize = (event: MouseEvent) => {
    if (!this.currentElement)
      return;

    // Helps to get current mouse cell.
    // Which help us to transform element.
    const cell = getCell(
      {
        x: event.clientX,
        y: event.clientY
      },
      {
        rect: this.rect,
        rows: this.rowsType,
        columns: this.columnsType
      });

    let left = this.savedElementPosition.cellX;
    let right = this.savedElementPosition.cellX + this.savedElementPosition.width - 1;
    let top = this.currentElement.position.cellY;
    let bottom = this.savedElementPosition.cellY + this.savedElementPosition.height - 1;

    switch (this.elementAction) {
      case ElementAction.left:
        if (!(this.currentElement.resizeLeft ?? true)) return;
        [left, right] = [cell.cellX, right];
        break;
      case ElementAction.right:
        if (!(this.currentElement.resizeRight ?? true)) return;
        [left, right] = [left, cell.cellX];
        break;
      case ElementAction.top:
        if (!(this.currentElement.resizeTop ?? true)) return;
        [top, bottom] = [cell.cellY, bottom];
        break;
      case ElementAction.bottom:
        if (!(this.currentElement.resizeBottom ?? true)) return;
        [top, bottom] = [top, cell.cellY];
        break;

      case ElementAction.left_top:
        if (!(this.currentElement.resizeLeft ?? true)) return;
        if (!(this.currentElement.resizeTop ?? true)) return;
        [left, top, right, bottom] = [cell.cellX, cell.cellY, right, bottom];
        break;
      case ElementAction.left_bottom:
        if (!(this.currentElement.resizeLeft ?? true)) return;
        if (!(this.currentElement.resizeBottom ?? true)) return;
        [left, top, right, bottom] = [cell.cellX, top, right, cell.cellY];
        break;
      case ElementAction.right_top:
        if (!(this.currentElement.resizeRight ?? true)) return;
        if (!(this.currentElement.resizeTop ?? true)) return;
        [left, top, right, bottom] = [left, cell.cellY, cell.cellX, bottom];
        break;
      case ElementAction.right_bottom:
        if (!(this.currentElement.resizeRight ?? true)) return;
        if (!(this.currentElement.resizeBottom ?? true)) return;
        [left, top, right, bottom] = [left, top, cell.cellX, cell.cellY];
        break;
    }
    this.currentElement.position = {
      ...this.currentElement.position,
      cellX: left,
      cellY: top,
      width: right - left + 1,
      height: bottom - top + 1
    };
  }

  public elementOnMove = (event: MouseEvent) => {
    if (!this.currentElement)
      return;

    const cell = getCell(
      {
        x: event.clientX,
        y: event.clientY
      },
      {
        rect: this.rect,
        rows: this.rowsType,
        columns: this.columnsType
      });

    const x = cell.cellX - this.savedMousePosition.cellX;
    const y = cell.cellY - this.savedMousePosition.cellY;

    this.currentElement.position = {
      ...this.currentElement.position,
      cellX: this.savedElementPosition.cellX + x,
      cellY: this.savedElementPosition.cellY + y
    }
  }

  private unsubscribeEvent() {
    this.currentElement = undefined;
    this.cursor = 'default';

    document.removeEventListener('mousemove', this.elementOnResize, true);
    document.removeEventListener('mousemove', this.elementOnMove, true);
    document.removeEventListener('mouseup', this.elementOnMouseUp, true);
  }

  public elementOnMouseUp = (event: MouseEvent) => {
    this.unsubscribeEvent();

    const element = this.rendererService.currentElement;

    // May find better position for it. Look at rxjs better.
    if (element)
      this.api.postElementById(element).subscribe();
  }

  private onSelectElement(element: Element, index: number) {
    this.currentElement = element;
    this.rendererService.currentElement = element;

    if (this.lastElementIndex || this.lastElementIndex == 0)
      this.elements_container.get(this.lastElementIndex)?.nativeElement.classList.remove('element-select');

    if (this.settings.corners) {
      this.lastElementIndex = index;
      this.elements_container.get(index)?.nativeElement.classList.add('element-select')
    }
  }

  public onMouseDown(event: MouseEvent, element: Element, index: number) {
    switch (this.settings.mode) {
      case RendererMode.select: {
        this.onSelectElement(element, index);

        this.savedElementPosition = { ...element.position };

        const cell = getCell(
          {
            x: event.clientX,
            y: event.clientY
          },
          {
            rect: this.rect,
            rows: this.rowsType,
            columns: this.columnsType
          });

        this.savedMousePosition = cell;

        const elementAction = getElementAction(event, element, this.mouseOffset);

        if (
          elementAction > ElementAction.none &&
          elementAction > ElementAction.move
        ) {
          this.elementAction = elementAction;
          document.addEventListener('mousemove', this.elementOnResize, true);
          document.addEventListener('mouseup', this.elementOnMouseUp, true);
        } else {
          document.addEventListener('mousemove', this.elementOnMove, true);
          document.addEventListener('mouseup', this.elementOnMouseUp, true);
        }
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
        rows: this.rowsType,
        columns: this.columnsType
      });

    const element = this.renderer.elementCreate({
      content: "Initial text",
      position: { ...cell, width: 5, height: 5 },
      resizeTop: true,
      resizeLeft: true,
      resizeRight: true,
      resizeBottom: true
    });

    this.savedElementPosition = { ...element.position };
    this.savedMousePosition = cell;

    this.settings.mode = this.RendererMode.select;
    this.rendererService.settings.mode = this.settings.mode;
  }
}
