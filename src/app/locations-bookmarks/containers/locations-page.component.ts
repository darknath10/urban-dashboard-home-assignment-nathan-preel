import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { filter, map, take, tap } from 'rxjs';
import { Coordinates } from '@lba/common/types';
import { LocationsBookmarksStore } from '../core/+state';
import { BookmarkedLocation, LocationBookmarkPayload } from '../core/models';
import { LocationBookmarkFormDialogComponent, LocationBookmarkFormDialogData } from './location-bookmark-form-dialog.component';

@Component({
  template: `
    <mat-toolbar>
      <button type="button" mat-icon-button (click)="sidenav.toggle()">
        <mat-icon>menu</mat-icon>
      </button>
    </mat-toolbar>
    <mat-sidenav-container class="flex-grow">
      <mat-sidenav #sidenav opened [mode]="(isHandset$ | async) === true ? 'over' : 'side'">
        <lba-bookmarked-locations-list
          [locations]="locations$ | async"
          (locationSelectionChange)="setSelectedLocation($event)"
          (editBtnClick)="openEditLocationBookmarkDialog($event)"
          (deleteBtnClick)="removeLocationBookmark($event)">
        </lba-bookmarked-locations-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <lba-map class="h-full"
          [markers]="locationsToMark$ | async"
          [selectedMarker]="selectedLocationMarker$ | async"
          (mapClick)="openCreateLocationBookmarkDialog($event)">
        </lba-map>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [
    `
      :host {
        @apply h-full flex flex-col;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationsPageComponent {
  readonly locations$ = this.store.locations$;

  readonly locationsToMark$ = this.store.locations$.pipe(
    map((locations) => locations.map(({latitude: lat, longitude: lng, name}) => ({coordinates: {lat, lng}, name}))),
  );

  readonly selectedLocationMarker$ = this.store.selectedLocation$.pipe(
    filter((value): value is BookmarkedLocation => !!value),
    map(({latitude: lat, longitude: lng}) => ({lat, lng})),
  );

  readonly isHandset$ = this.breakpointObserver.observe(Breakpoints.HandsetPortrait).pipe(
    map(({matches}) => matches),
  );

  constructor(
    private readonly dialog: MatDialog,
    private readonly store: LocationsBookmarksStore,
    private readonly breakpointObserver: BreakpointObserver,
  ) {}

  openCreateLocationBookmarkDialog({lat, lng}: Coordinates) {
    const data: LocationBookmarkFormDialogData = {
      dialogTitle: 'Create Bookmark Location',
      locationBookmarkPayload: { name: '', description: '', latitude: lat, longitude: lng },
    };
    this.dialog.open(LocationBookmarkFormDialogComponent, { data }).afterClosed().pipe(
      filter((result) => !!result),
      tap((result: LocationBookmarkPayload) => this.store.addLocation(result)),
      take(1),
    ).subscribe();
  }

  openEditLocationBookmarkDialog(location: BookmarkedLocation) {
    const {id, ...locationBookmarkPayload} = location;
    const data: LocationBookmarkFormDialogData = {
      dialogTitle: `Edit Bookmark Location: ${location.name}`,
      locationBookmarkPayload,
    };
    this.dialog.open(LocationBookmarkFormDialogComponent, { data }).afterClosed().pipe(
      filter((result) => !!result),
      tap((payload) => this.store.editLocation(id, payload)),
      take(1),
    ).subscribe();
  }

  removeLocationBookmark({id}: {id: number}) {
    this.store.removeLocation(id);
  }

  setSelectedLocation({id} : {id: number}) {
    this.store.setSelectedLocationId(id);
  }
}
