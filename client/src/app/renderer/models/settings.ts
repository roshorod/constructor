import { RendererMode } from "./mode";

type gridSettings = {
  rows: number;
  columns: number;

  lines: boolean;
  corners: boolean;
  background?: string;
};



export type settings = gridSettings & {
  mode: RendererMode;
};
