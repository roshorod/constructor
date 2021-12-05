import { RendererMode } from "./mode";

type GridUnits = {
  pixelType: 'px' | 'fr';
  pixelSize: number;
};

type GridSettings = GridUnits & {
  rows: number;
  columns: number;

  lines: boolean;
  corners: boolean;
  background?: string;
};

type SideNavSettings = {
  sideNavMode: 'over' | 'side';
};

export type Settings = GridSettings & SideNavSettings & {
  mode: RendererMode;
};
