import { Cell } from './cell';

export type Position = Cell & {
  width: number;
  height: number;
};
