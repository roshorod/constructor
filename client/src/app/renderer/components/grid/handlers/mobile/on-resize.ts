import { getCell } from "@renderer/models/units.utils";
import { Element, ElementAction } from "@renderer/models/element";
import { GridProps } from "@renderer/components/grid/props";
import { transformElementByAction } from "@renderer/models/element.utils";

export function onResize(event: TouchEvent, element: Element, gridProps: GridProps) {

  if (!gridProps.rect)
    throw new Error("Grid props is undefined");

  const cell = getCell(
    {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    },
    {
      rect: gridProps.rect,
      rows: gridProps.rows,
      columns: gridProps.columns
    });

  const position = { ...gridProps.position };

  let left = position.cellX;
  let right = position.cellX - position.width - 1;
  let top = position.cellY;
  let bottom = position.cellY + position.height - 1;

  let action: ElementAction = 0;

  if (left > cell.cellX)
    action = ElementAction.left;
  if (right < cell.cellX)
    action = ElementAction.right;
  if (top > cell.cellY)
    action = ElementAction.top;
  if (bottom < cell.cellY)
    action = ElementAction.bottom;

  transformElementByAction(
    element,
    action,
    cell,
    {
      left: position.cellX,
      right: position.cellX + position.width - 1,
      top: position.cellY,
      bottom: position.cellY + position.height - 1
    }
  );
}
