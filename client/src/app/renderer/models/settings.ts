import { RendererMode } from "./mode";

type gridUnits = {
  pixelType: 'px' | 'fr';
  pixelSize: number;
};

type gridSettings = gridUnits & {
  rows: number;
  columns: number;

  lines: boolean;
  corners: boolean;
  background?: string;
};



export type settings = gridSettings & {
  mode: RendererMode;
};
