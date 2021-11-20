export type Size = {
  size: number;
  pxType: 'px' | 'fr';
};

export type Cell = {
  cellX: number;
  cellY: number;
};

export type Position = Cell & {
  width: number;
  height: number;
};
