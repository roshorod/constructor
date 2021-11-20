import { Cell, Size } from "./units";

/*
* Get position of cell depend of input
* Element may be plain cords from MouseEvent
*/
export function getCell(
  element: { x: number, y: number },
  grid: { rect: DOMRect, rows: Size[], columns: Size[] }
): Cell {

  const x = element.x - grid.rect.x;
  const y = element.y - grid.rect.y;

  const xAmount = getCellAmount(grid.columns);
  const yAmount = getCellAmount(grid.rows);

  let pxWidth = grid.rect.width - xAmount.amountPx;
  let pxHeight = grid.rect.height - yAmount.amountPx;

  let frWidth = pxWidth / xAmount.amountFr;
  let frHeight = pxHeight / yAmount.amountFr;

  return {
    cellX: getCellPosition(grid.columns, x, frWidth),
    cellY: getCellPosition(grid.rows, y, frHeight)
  }
}

/*
* Count how much fr units and px units
*/
function  getCellAmount(
  container: Size[]
): { amountPx: number, amountFr: number } {

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

function getCellPosition(
  container: Size[], pxPos: number, frPos: number
): number {

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
