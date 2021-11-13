import { Component, ElementRef, Input, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { Element, ElementAction } from "@renderer/models/element";
import { Position } from "@renderer/models/position";
import { Size } from "@renderer/models/size";
import { Cell } from '@renderer/models/cell';
import { RendererService } from "@renderer/services/renderer.service";
import { Subject } from "rxjs";
import { switchMap, debounceTime, takeLast } from "rxjs/operators";
import { ApiClientSerivce } from "@renderer/services/api-client.service";

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent {
  @ViewChild('gird_container') grid_container: ElementRef;
  @ViewChildren('elements_container') elements_container: QueryList<ElementRef>;

  @Input() public pixelType: 'px'|'fr' = 'fr';
  @Input() public pixelSize: number = 1;

  @Input() public set rows(numbers: number) {
    this.rowsType = [];

    //Tested on 1000 rows and columns with grid lines and it's crash the app
    // May be allow without grid lines?
    if (numbers > 200)
      numbers = 199;

    for (var i = 0; i < numbers; i++) {
      this.rowsType.push({ size: this.pixelSize, pxType: this.pixelType });
    }
  }

  @Input() public set columns(numbers: number) {
    this.columnsType = [];

    if (numbers > 200)
      numbers = 199;

    for (var i = 0; i < numbers; i++) {
      this.columnsType.push({ size: this.pixelSize, pxType: this.pixelType });
    }
  }

  @Input() public rowsType: Size[] = [];
  @Input() public columnsType: Size[] = [];

  @Input() public elements: Element[] = [];

  @Input() public showLines: boolean = true;

  private corners: boolean = this.showCorners;
  @Input() public set showCorners(value: boolean) {
    this.corners = value;
  };

  public get showCorners(): boolean {
    return this.corners;
  }

  public cursor: string = 'default';
  private mouseOffset: number = 5;

  private savedMousePosition: Cell;

  private savedElementPosition: Position;
  private currentElement?: Element;
  private lastElementIndex?: number;

  private elementAction = ElementAction.none;

  private get rect(): DOMRect {
    return this.grid_container.nativeElement.getBoundingClientRect();
  }

  constructor(
    private rendererService: RendererService,
    private api: ApiClientSerivce
  ) { }

  private elementRect(element: any): DOMRect {
    return element.getBoundingClientRect();
  }

  public getCell(xPos: number, yPos: number): Cell {
    const x = xPos - this.rect.x;
    const y = yPos - this.rect.y;

    const xAmount = this.getCellAmount(this.columnsType);
    const yAmount = this.getCellAmount(this.rowsType);

    let pxWidth = this.rect.width - xAmount.amountPx;
    let pxHeight = this.rect.height - yAmount.amountPx;

    let frWidth = pxWidth / xAmount.amountFr;
    let frHeight = pxHeight / yAmount.amountFr;

    return {
      cellX: this.getCellPosition(this.columnsType, x, frWidth),
      cellY: this.getCellPosition(this.rowsType, y, frHeight)
    }
  }

  private getCellAmount(container: Size[])
    : { amountPx: number, amountFr: number } {
    let amountPx = 0;
    let amountFr = 0;

    container.forEach(i => {
      switch (i.pxType) {
        case 'px':
          amountPx += i.size;
          break;
        case 'fr':
          amountFr += i.size;
          break;
      }
    });

    return {
      amountPx,
      amountFr
    };
  }

  private getCellPosition(container: Size[], pxPos: number, frPos: number): number {
    let start = 0;
    let end = 0;
    let cell = container.length - 1;

    for (let i = 0; i < container.length; i++) {
      const _cell = container[i];
      const _start = start;

      switch (_cell.pxType) {
        case 'fr':
          start += frPos * _cell.size;
          break;
        case 'px':
          start += _cell.size;
          break;
      }
      if (start > pxPos) {
        cell = i;
        end = start;

        for (let j = i + 1; j < i + 1 && j < container.length; j++)
          switch (_cell.pxType) {
            case 'fr':
              end += frPos * _cell.size;
              break;
            case 'px':
              end += _cell.size;
              break;
          }
        start = _start;
        break;
      }
    }
    return cell;
  }

  private getElementAction(event: MouseEvent, element: Element): ElementAction {
    const rect = this.elementRect(event.target);

    const left = event.clientX - rect.left;
    const right = rect.right - event.clientX;
    const top = event.clientY - rect.top;
    const bottom = rect.bottom - event.clientY;

    if (
      left >= 0 &&
      left < this.mouseOffset &&
      top >= 0 &&
      top < this.mouseOffset &&
      (element.resizeLeft ?? true) &&
      (element.resizeTop ?? true)
    )
      return ElementAction.left_top;
    else if (
      left >= 0 &&
      left < this.mouseOffset &&
      bottom >= 0 &&
      bottom < this.mouseOffset &&
      (element.resizeLeft ?? true) &&
      (element.resizeBottom ?? true))
      return ElementAction.left_bottom;
    else if (
      right >= 0 &&
      right < this.mouseOffset &&
      top >= 0 &&
      top < this.mouseOffset &&
      (element.resizeRight ?? true) &&
      (element.resizeTop ?? true))
      return ElementAction.right_top;
    else if (right >= 0 &&
      right < this.mouseOffset &&
      bottom >= 0 &&
      bottom < this.mouseOffset &&
      (element.resizeRight ?? true) &&
      (element.resizeBottom ?? true))
      return ElementAction.right_bottom;
    else if (
      left >= 0 &&
      left < this.mouseOffset &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom &&
      (element.resizeLeft ?? true))
      return ElementAction.left;
    else if (
      right >= 0 &&
      right < this.mouseOffset &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom &&
      (element.resizeRight ?? true))
      return ElementAction.right;
    else if (
      top >= 0 &&
      top < this.mouseOffset &&
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      (element.resizeTop ?? true))
      return ElementAction.top;
    else if (
      bottom >= 0 &&
      bottom < this.mouseOffset &&
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      (element.resizeBottom ?? true))
      return ElementAction.bottom;
    else if (
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom)
      return ElementAction.move;
    else
      return ElementAction.none;
  }

  public onMouseMove(event: MouseEvent, element: Element) {
    switch (this.getElementAction(event, element)) {
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

  private elementOnResize = (event: MouseEvent) => {
    if (!this.currentElement)
      return;

    const cell = this.getCell(event.clientX, event.clientY);

    let left = this.savedElementPosition.cellX;
    let right = this.savedElementPosition.cellX + this.savedElementPosition.width - 1;
    let top = this.currentElement.position.cellY;
    let bottom = this.savedElementPosition.cellY + this.savedElementPosition.height - 1;

    const resizeLeftRight = (): [number, number] => {
      left = this.savedElementPosition.cellX;
      right = cell.cellX;

      if (left > right)
        [left, right] = [right, left];

      return [left, right];
    }
    const resizeTopBottom = (): [number, number] => {
      top = this.savedElementPosition.cellY;
      bottom = cell.cellY;

      if (top > bottom)
        [top, bottom] = [bottom, top];

      return [top, bottom];
    }

    const resizeCorner = (): [number, number, number, number] => {
      left = this.savedElementPosition.cellX;
      top = this.savedElementPosition.cellY;
      right = cell.cellX;
      bottom = cell.cellY;

      if (left > right)
        [left, right] = [right, left];

      if (top > bottom)
        [top, bottom] = [bottom, top];

      return [left, top, right, bottom];
    }

    switch (this.elementAction) {
      case ElementAction.left:
        if (!(this.currentElement.resizeLeft ?? true)) return;
        [left, right] = resizeLeftRight();
        break;
      case ElementAction.right:
        if (!(this.currentElement.resizeRight ?? true)) return;
        [left, right] = resizeLeftRight();
        break;
      case ElementAction.top:
        if (!(this.currentElement.resizeTop ?? true)) return;
        [top, bottom] = resizeTopBottom();
        break;
      case ElementAction.bottom:
        if (!(this.currentElement.resizeBottom ?? true)) return;
        [top, bottom] = resizeTopBottom();
        break;

      case ElementAction.left_top:
        if (!(this.currentElement.resizeLeft ?? true)) return;
        if (!(this.currentElement.resizeTop ?? true)) return;
        [left, top, right, bottom] = resizeCorner();
        break;
      case ElementAction.left_bottom:
        if (!(this.currentElement.resizeLeft ?? true)) return;
        if (!(this.currentElement.resizeBottom ?? true)) return;
        [left, top, right, bottom] = resizeCorner();

        break;
      case ElementAction.right_top:
        if (!(this.currentElement.resizeRight ?? true)) return;
        if (!(this.currentElement.resizeTop ?? true)) return;
        [left, top, right, bottom] = resizeCorner();

        break;
      case ElementAction.right_bottom:

        if (!(this.currentElement.resizeRight ?? true)) return;
        if (!(this.currentElement.resizeBottom ?? true)) return;
        [left, top, right, bottom] = resizeCorner();

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

    const cell = this.getCell(event.clientX, event.clientY);

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

    if (this.showCorners) {
      this.lastElementIndex = index;
      this.elements_container.get(index)?.nativeElement.classList.add('element-select')
    }
  }

  public onMouseDown(event: MouseEvent, element: Element, index: number) {
    this.onSelectElement(element, index);

    this.savedElementPosition = { ...element.position }

    this.savedMousePosition = this.getCell(event.clientX, event.clientY);

    const elementAction = this.getElementAction(event, element);

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
  }
}
