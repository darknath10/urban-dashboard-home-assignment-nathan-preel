import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { MapModule } from '@lba/map';
import { BookmarkedLocationsListComponent } from './components';
import { LocationBookmarkFormDialogComponent, LocationBookmarkFormComponent, LocationsPageComponent } from './containers';
import { LocationsBookmarksStore } from './core/+state';
import { ROUTES } from './routes';

@NgModule({
  declarations: [
    BookmarkedLocationsListComponent,
    LocationBookmarkFormDialogComponent,
    LocationsPageComponent,
    LocationBookmarkFormComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    ReactiveFormsModule,
    RouterModule.forChild(ROUTES),
    MapModule,
  ],
  providers: [LocationsBookmarksStore],
})
export class LocationsBookmarksModule { }
