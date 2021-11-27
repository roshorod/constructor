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

type sideNavSettings = {
  sideNavMode: 'over' | 'side';
};

export type settings = gridSettings & sideNavSettings & {
  mode: RendererMode;
};
