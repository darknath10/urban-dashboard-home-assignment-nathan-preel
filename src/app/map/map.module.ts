import { ModuleWithProviders, NgModule } from '@angular/core';
import { MapConfig, MAP_CONFIG_TOKEN } from './config';
import { MapComponent } from './map.component';

@NgModule({
  declarations: [MapComponent],
  exports: [MapComponent],
})
export class MapModule {
  static forRoot(config: MapConfig): ModuleWithProviders<MapModule> {
    return {
      ngModule: MapModule,
      providers: [
        {
          provide: MAP_CONFIG_TOKEN,
          useValue: config,
        },
      ],
    };
  }
}
