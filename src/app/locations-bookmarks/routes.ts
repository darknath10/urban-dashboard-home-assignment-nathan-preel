import { Route } from '@angular/router';
import { LocationsPageComponent } from './containers';

export const ROUTES: Route[] = [
  {
    path: '',
    component: LocationsPageComponent,
    pathMatch: 'full',
  },
];
