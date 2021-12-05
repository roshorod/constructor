import { InjectionToken } from "@angular/core";
import { Settings } from "@renderer/models/settings";

export const CONFIG = new InjectionToken<Settings>(
  "Determine which settings should be used",
  {
    factory: () => {
      const screenWidth = window.screen.width;

      if (screenWidth < 801)
        return mobile;
      else return desktop;
    }
  }
);

const mobile: Settings = {
  mode: 0,

  sideNavMode: 'over',

  pixelType: 'fr',
  pixelSize: 1,

  rows: 20,
  columns: 10,

  lines: true,
  corners: true,
};

const desktop: Settings = {
  mode: 0,

  sideNavMode: 'side',

  pixelType: 'fr',
  pixelSize: 1,

  rows: 40,
  columns: 60,

  lines: true,
  corners: true,
};
