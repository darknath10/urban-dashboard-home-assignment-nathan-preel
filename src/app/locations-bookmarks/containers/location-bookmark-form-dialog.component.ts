import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocationBookmarkPayload } from '../core/models';

export type LocationBookmarkFormDialogData = {
  dialogTitle: string;
  locationBookmarkPayload: LocationBookmarkPayload;
};

@Component({
  template: `
    <h1 mat-dialog-title>{{data.dialogTitle}}</h1>
    <lba-location-bookmark-form class="w-1/2"
      [data]="data.locationBookmarkPayload"
      (locationBookmartFormSubmit)="dialogRef.close($event)"
      (locationBookmarkFormCancel)="dialogRef.close()">
    </lba-location-bookmark-form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationBookmarkFormDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly data: LocationBookmarkFormDialogData,
    public readonly dialogRef: MatDialogRef<LocationBookmarkFormDialogComponent>,
  ) {}
}