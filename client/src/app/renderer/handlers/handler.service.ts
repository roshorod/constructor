import { Injectable, inject} from "@angular/core";

import { StoreService } from "@services/store.service";
import { getCell } from "@renderer/models/units.utils";
import { Element, ElementAction } from "@renderer/models/element";
import { getElementAction, makeElement } from "@renderer/models/element.utils";

import { Handler } from "./handler.interface";
import { MOBILE } from "./mobile";
import { DESKTOP } from "./desktop";

import { GridPropsService } from "@grid/grid.props-service";
import { GridProps } from "@grid/grid.props";
import { SettingsService } from "@services/settings.service";
import { Settings } from "@renderer/models/settings";
import { RendererMode } from "@renderer/models/mode";

@Injectable({
  providedIn: 'root'
})
export class HandlerService implements Handler {
  public cursor: string = 'default';

  private provider: Handler;
  private gProps: GridProps;
  private settings: Settings;

  onResize: { type: string, callback: (event: Event) => void };
  onMove: { type: string, callback: (event: Event) => void };
  onEnd: { type: string, callback: (event: Event) => void };

  constructor(
    private store: StoreService,
    private settingsService: SettingsService,
    private gPropsService: GridPropsService
  ) {
    if (window.screen.width < 801)
      this.provider = inject(MOBILE);
    else
      this.provider = inject(DESKTOP);

    Object.assign(this, this.provider);

    this.settingsService.settings$
      .subscribe(settings => this.settings = settings);

    this.gPropsService.gridProps$
      .subscribe(props => this.gProps = props);
  }

  public onElementSetHandler(event: Event, element: Element, rect: DOMRect) {
    let action = 0;
    var offset = 5;

    let x: number = 0;
    let y: number = 0;

    if (event instanceof MouseEvent) {
      action = getElementAction(event, element, offset);

      x = event.clientX;
      y = event.clientY;

    } else if (event instanceof TouchEvent) {
      action = getElementAction(event, element, offset);

      x = event.touches[0].clientX;
      y = event.touches[0].clientY;
    }

    this.store.select(element);

    var cell = getCell(
      { x, y },
      {
        rect,
        rows: this.gProps.rows,
        columns: this.gProps.columns
      });

    const boundWidth = this.settings.columns - element.position.width;
    const boundHeight = this.settings.rows - element.position.height;

    this.gPropsService.updateGridProps({
      ...this.gProps,
      mouse: cell,
      action,
      position: element.position,
      boundWidth,
      boundHeight,
      rect
    });

    switch (this.settings.mode) {
      case RendererMode.select: {
        if (
          action > ElementAction.none &&
          action > ElementAction.move
        ) {

          document.addEventListener(
            this.onResize.type,
            this.onResize.callback,
            true
          );

          document.addEventListener(
            this.onEnd.type,
            this.onEnd.callback,
            true
          );

        } else {

          document.addEventListener(
            this.onMove.type,
            this.onMove.callback,
            true
          );

          document.addEventListener(
            this.onEnd.type,
            this.onEnd.callback,
            true
          );
        }

        break;
      }
      case RendererMode.resize: {
        if (event instanceof MouseEvent) {
          action = getElementAction(event, element, offset);

          x = event.clientX;
          y = event.clientY;

        } else if (event instanceof TouchEvent) {
          action = getElementAction(event, element, 100);

          x = event.touches[0].clientX;
          y = event.touches[0].clientY;
        }

        this.gPropsService.updateGridProps({
          ...this.gProps,
          mouse: cell,
          action,
          position: element.position,
        });

        document.addEventListener(
          this.onResize.type,
          this.onResize.callback,
          true
        );

        document.addEventListener(
          this.onEnd.type,
          this.onEnd.callback,
          true
        );

        break;
      }
    }
  }

  public onCursor(event: MouseEvent, element: Element, offset: number) {
    switch (getElementAction(event, element, offset)) {
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

  public onElementCreate(event: MouseEvent, rect: DOMRect) {
    const cell = getCell(
      {
        x: event.clientX,
        y: event.clientY
      },
      {
        rect,
        rows: this.gProps.rows,
        columns: this.gProps.columns,
      });

    const signature: Element = makeElement();

    signature.position = { ...cell, width: 5, height: 5 };

    this.store.create(signature)
      .subscribe((element) => {
        this.store.select(element);
      });

    this.settingsService.update({
      ...this.settingsService.getValue(),
      mode: RendererMode.select
    });
  }
}
