import { Route } from '@angular/router';

export const APP_ROUTES: Route[] = [
  {
    path: 'locations-bookmarks',
    loadChildren: async () => (await import('@lba/locations-bookmarks')).LocationsBookmarksModule,
  },
  {
    path: '',
    redirectTo: 'locations-bookmarks',
    pathMatch: 'full',
  },
];
