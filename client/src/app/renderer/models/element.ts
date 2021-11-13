import { Position } from "@renderer/models/position";

export abstract class Element {
  public id?: string;

  public position: Position;

  public content?: string;

  public color?: string;
  public background?: string;

  public resizeTop?: boolean;
  public resizeLeft?: boolean;
  public resizeRight?: boolean;
  public resizeBottom?: boolean;

  public destroy?: any;
}

export enum ElementAction {
  none = 0,
  move = 1,

  left = 2,
  top = 3,
  right = 4,
  bottom = 5,

  left_top = 6,
  left_bottom = 7,
  right_top = 8,
  right_bottom = 9
}
