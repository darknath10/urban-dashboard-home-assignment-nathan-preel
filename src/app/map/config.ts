import { InjectionToken } from '@angular/core';

export type MapConfig = {
  tileLayerTemplateUrl: string;
  initialCenter: [number, number];
  initialZoomLevel: number;
};

export const MAP_CONFIG_TOKEN = new InjectionToken<MapConfig>('MAP_CONFIG_TOKEN');
