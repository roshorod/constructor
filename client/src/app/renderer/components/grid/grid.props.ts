import { Position } from "@renderer/models/units";
import { ElementAction } from "@renderer/models/element";
import { Cell, Size } from "@renderer/models/units";

export type GridProps = {
  rows: Size[];
  columns: Size[];

  action: ElementAction;

  /*
   * Save position when pressed on element
   * (pressed on center moving by center)
   */
  mouse: Cell;
  /*
   * Save element position when pressed on it
   */
  position: Position;

  rect?: DOMRect;

  boundWidth: number;
  boundHeight: number;
};
