import { Injectable, inject } from "@angular/core";

import { Element, ElementAction } from "@renderer/models/element";
import { getElementAction } from "@renderer/models/element.utils";

import { Handler } from "./handler.interface";
import { MOBILE } from "./mobile";
import { DESKTOP } from "./desktop";


@Injectable()
export class HandlerService implements Handler {
  public cursor: string = 'default';

  private provider: Handler;

  onResize: { type: string, callback: (event: Event) => void };
  onMove: { type: string, callback: (event: Event) => void };
  onEnd: { type: string, callback: (event: Event) => void };

  constructor() {
    if (window.screen.width < 801)
      this.provider = inject(MOBILE);
    else
      this.provider = inject(DESKTOP);

    Object.assign(this, this.provider);
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

}
