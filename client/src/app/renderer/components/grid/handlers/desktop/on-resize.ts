import { getCell } from "@renderer/models/units.utils";
import { Element } from "@renderer/models/element";
import { GridProps } from "@renderer/components/grid/grid.props";
import { transformElementByAction } from "@renderer/models/element.utils";

export function onResize(event: MouseEvent, element: Element, gridProps: GridProps) {

  if (!gridProps.rect)
    throw new Error("Grid props is undefined");

  const cell = getCell(
    {
      x: event.clientX,
      y: event.clientY
    },
    {
      rect: gridProps.rect,
      rows: gridProps.rows,
      columns: gridProps.columns
    });

  const position = { ...element.position };

  transformElementByAction(
    element,
    gridProps.action,
    cell,
    {
      left: position.cellX,
      right: position.cellX + position.width - 1,
      top: position.cellY,
      bottom: position.cellY + position.height - 1
    }
  );
}
