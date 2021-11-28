import { Component, ElementRef, Input,
         QueryList, ViewChild, ViewChildren } from "@angular/core";
import { Element, ElementAction } from "@renderer/models/element";
import { getCell } from "@renderer/models/units.utils";
import { Cell, Size, Position } from "@renderer/models/units";
import { RendererService } from "@renderer/services/renderer.service";
import { ApiClientSerivce } from "@renderer/services/api-client.service";
import { RendererComponent } from "@renderer/renderer.component";
import { RendererMode } from "@renderer/models/mode";
import { settings } from "@renderer/models/settings";
import { getElementAction,
         transformElementByAction } from "@renderer/models/element.utils";

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
})
export class GridComponent {
  @ViewChild('gird_container') grid_container: ElementRef;
  @ViewChildren('elements_container') elements_container: QueryList<ElementRef>;

  @Input() public settings: settings;
  @Input() public elements: Element[] | null = [];

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

  public get rows(): number {
    return this.rowsType.length;
  }

  public get columns(): number {
    return this.columnsType.length;
  }

  public rowsType: Size[] = [];
  public columnsType: Size[] = []

  public cursor: string = 'default';
  public RendererMode = RendererMode;

  private offset: number = 5;
  private savedMousePosition: Cell;
  private savedElementPosition: Position;

  private currentElement?: Element;
  /*
   * Used for border around element.
   */
  private lastElementIndex?: number;

  private elementAction = ElementAction.none;

  private boundWidth: number;
  private boundHeight: number;

  constructor(
    public rendererService: RendererService,
    private api: ApiClientSerivce,
    private renderer: RendererComponent
  ) { }

  private get rect(): DOMRect {
    return this.grid_container.nativeElement.getBoundingClientRect();
  }

  public onMouseMove(event: MouseEvent, element: Element) {
    if (this.settings.mode == 0 || this.settings.mode == 2)
      switch (getElementAction(event, element, this.offset)) {
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
  private elementOnResize = async (event: MouseEvent) => {
    if (!this.currentElement)
      return;

    // Get cell of resized element
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

    // Transform element to show resize
    await transformElementByAction(
      this.currentElement,
      this.elementAction,
      cell,
      {
        left: this.savedElementPosition.cellX,
        right: this.savedElementPosition.cellX + this.savedElementPosition.width - 1,
        top: this.savedElementPosition.cellY,
        bottom: this.savedElementPosition.cellY + this.savedElementPosition.height - 1
      });
  }

  public elementOnTouchResize = async (event: TouchEvent) => {
    if (!this.currentElement)
      return;

    const cell = getCell(
      {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      },
      {
        rect: this.rect,
        rows: this.rowsType,
        columns: this.columnsType
      });

    let left = this.savedElementPosition.cellX;
    let right = this.savedElementPosition.cellX
      + this.savedElementPosition.width - 1;

    let top = this.savedElementPosition.cellY;
    let bottom = this.savedElementPosition.cellY
      + this.savedElementPosition.height - 1;

    if (left > cell.cellX)
      this.elementAction = ElementAction.left;
    if (right < cell.cellX)
      this.elementAction = ElementAction.right;
    if (top > cell.cellY)
      this.elementAction = ElementAction.top;
    if (bottom < cell.cellY)
      this.elementAction = ElementAction.bottom;

    await transformElementByAction(
      this.currentElement,
      this.elementAction,
      cell,
      {
        left: left,
        right: right,
        top: top,
        bottom: bottom
      });
  }

  public elementOnMove = async (event: MouseEvent) => {
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

    const newCellX = this.savedElementPosition.cellX + x;
    const newCellY = this.savedElementPosition.cellY + y;

    if (
      (newCellX >= 0 && newCellX <= this.boundWidth) &&
      (newCellY >= 0 && newCellY <= this.boundHeight)
    )
      this.currentElement.position = await {
        ...this.currentElement.position,
        cellX: newCellX,
        cellY: newCellY
      }
  }

  public elementOnTouchMove =  async (event: TouchEvent) => {
    if (!this.currentElement)
      return;

    const cell = getCell(
      {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      },
      {
        rect: this.rect,
        rows: this.rowsType,
        columns: this.columnsType
      });

    const x = cell.cellX - this.savedMousePosition.cellX;
    const y = cell.cellY - this.savedMousePosition.cellY;

    const newCellX = this.savedElementPosition.cellX + x;
    const newCellY = this.savedElementPosition.cellY + y;

    if (
      (newCellX >= 0 && newCellX <= this.boundWidth) &&
      (newCellY >= 0 && newCellY <= this.boundHeight)
    )
      this.currentElement.position = await {
        ...this.currentElement.position,
        cellX: newCellX,
        cellY: newCellY
      }
  }

  public elementOnMouseUp = (event: MouseEvent) => {
    if (this.currentElement)
      this.api.postElementById(this.currentElement).subscribe();

    this.currentElement = undefined;
    this.cursor = 'default';

    document.removeEventListener('mousemove', this.elementOnResize, true);
    document.removeEventListener('mousemove', this.elementOnMove, true);
    document.removeEventListener('mouseup', this.elementOnMouseUp, true);
  }

  public elementOnTouchEnd = (event: TouchEvent) => {
    if (this.currentElement)
      this.api.postElementById(this.currentElement).subscribe();

    this.currentElement = undefined;

    document.removeEventListener('touchmove', this.elementOnTouchResize, true);
    document.removeEventListener('touchmove', this.elementOnTouchMove, true);
    document.removeEventListener('touchend', this.elementOnTouchEnd, true);
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

        const elementAction = getElementAction(event, element, this.offset);

        if (
          elementAction > ElementAction.none &&
          elementAction > ElementAction.move
        ) {
          this.elementAction = elementAction;

          document.addEventListener('mousemove', this.elementOnResize, true);
          document.addEventListener('mouseup', this.elementOnMouseUp, true);
        } else {

          const x = cell.cellX - this.savedMousePosition.cellX;
          const y = cell.cellY - this.savedMousePosition.cellY;

          this.boundWidth = Math.abs(x - element.position.width + this.columns);
          this.boundHeight = Math.abs(y + element.position.height - this.rows);

          document.addEventListener('mousemove', this.elementOnMove, true);
          document.addEventListener('mouseup', this.elementOnMouseUp, true);
        }
        break;
      }
      case RendererMode.resize: {
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

        this.elementAction = getElementAction(event, element, this.offset);

        document.addEventListener('mousemove', this.elementOnResize, true);
        document.addEventListener('mouseup', this.elementOnMouseUp, true);
      }
    }
  }

  public onTouchStart(event: TouchEvent, element: Element, index: number) {
    switch (this.settings.mode) {
      case RendererMode.select: {
        this.onSelectElement(element, index);
        this.savedElementPosition = { ...element.position };

        const cell = getCell(
          {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
          },
          {
            rect: this.rect,
            rows: this.rowsType,
            columns: this.columnsType
          });

        this.savedMousePosition = cell;

        const x = cell.cellX - this.savedMousePosition.cellX;
        const y = cell.cellY - this.savedMousePosition.cellY;

        this.boundWidth = x + element.position.width;
        this.boundHeight = Math.abs(y + element.position.height - this.rows);

        document.addEventListener('touchmove', this.elementOnTouchMove, true);
        document.addEventListener('touchend', this.elementOnTouchEnd, true);

        break;
      };
      case RendererMode.resize: {
        this.onSelectElement(element, index);
        this.savedElementPosition = { ...element.position };

        const cell = getCell(
          {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
          },
          {
            rect: this.rect,
            rows: this.rowsType,
            columns: this.columnsType
          });

        this.savedMousePosition = cell;

        document.addEventListener('touchmove', this.elementOnTouchResize, true);
        document.addEventListener('touchend', this.elementOnTouchEnd, true);

        break;
      };
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
