import { Element } from "@renderer/models/element";
import { getCell } from "@renderer/models/units.utils";
import { GridProps } from "@renderer/components/grid/grid.props";

export function onMove(event: TouchEvent, element: Element, gridProps: GridProps) {

  if (!gridProps.rect)
    throw new Error('Grid rect is undefined');

  const cell = getCell(
    {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    },
    {
      rect: gridProps.rect,
      rows: gridProps.rows,
      columns: gridProps.columns
    }
  );

  const position = { ...gridProps.position };
  const mouse = { ...gridProps.mouse };

  const x = cell.cellX - mouse.cellX;
  const y = cell.cellY - mouse.cellY;

  const cellX = position.cellX +  x;
  const cellY = position.cellY + y;

  element.position = {
    ...position,
    cellX: cellX >= 0 && cellX <= gridProps.boundWidth ? cellX : element.position.cellX,
    cellY: cellY >= 0 && cellY <= gridProps.boundHeight ? cellY : element.position.cellY
  };
}
