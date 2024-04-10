import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { distinctUntilChanged, map } from 'rxjs';
import { LocationBookmarkPayload } from '../core/models';

const LatitudeRange = {
  MIN: -90,
  MAX: 90,
} as const;

const LongitudeRange = {
  MIN: -180,
  MAX: 180,
} as const;

@Component({
  selector: 'lba-location-bookmark-form',
  template: `
    <form [formGroup]="locationBookmarkForm" (ngSubmit)="emitLocationBookmarkFormValue()">
      <div class="flex flex-col">
        <mat-form-field appearance="standard">
          <mat-label>Name</mat-label>
          <input type="text" matInput formControlName="name">
          <mat-error *ngIf="nameFormCtrlError$ | async as errorMsg">{{errorMsg}}</mat-error>
        </mat-form-field>
        <mat-form-field appearance="standard">
          <mat-label>Description</mat-label>
          <input type="text" matInput formControlName="description">
        </mat-form-field>
        <mat-form-field appearance="standard">
          <mat-label>Latitude</mat-label>
          <input type="number" matInput formControlName="latitude">
          <mat-error *ngIf="latitudeFormCtrlError$ | async as errorMsg">{{errorMsg}}</mat-error>
        </mat-form-field>
        <mat-form-field appearance="standard">
          <mat-label>Longitude</mat-label>
          <input type="number" matInput formControlName="longitude">
          <mat-error *ngIf="longitudeFormCtrlError$ | async as errorMsg">{{errorMsg}}</mat-error>
        </mat-form-field>
      </div>
      <button mat-button color="primary" type="submit">Submit</button>
      <button mat-button type="button" (click)="emitCancel()">Cancel</button>
    </form>
  `,
})
export class LocationBookmarkFormComponent implements OnInit {
  private nameFormCtrl = new FormControl('', [Validators.required]);

  private latitudeFormCtrl = new FormControl(0, [
    Validators.required,
    Validators.min(LatitudeRange.MIN),
    Validators.max(LatitudeRange.MAX),
    ],
  );

  private longitudeFormCtrl = new FormControl(0, [
    Validators.required,
    Validators.min(LongitudeRange.MIN),
    Validators.max(LongitudeRange.MAX),
    ],
  );

  locationBookmarkForm = new FormGroup({
    name: this.nameFormCtrl,
    description: new FormControl(''),
    latitude: this.latitudeFormCtrl,
    longitude: this.longitudeFormCtrl,
  });

  nameFormCtrlError$ = this.nameFormCtrl.statusChanges.pipe(
    distinctUntilChanged(),
    map((status) => status === 'INVALID' ? 'Name is required' : undefined),
  );

  latitudeFormCtrlError$ = this.latitudeFormCtrl.statusChanges.pipe(
    distinctUntilChanged(),
    map((_) => this.latitudeFormCtrl.errors),
    map((errors) => errors?.['required'] ? 'Latitude is required' :
      errors?.['min'] ? `Latitude min value is ${LatitudeRange.MIN}` :
      errors?.['max'] ? `Latitude max value is ${LatitudeRange.MAX}` : undefined,
    ),
  );

  longitudeFormCtrlError$ = this.longitudeFormCtrl.statusChanges.pipe(
    distinctUntilChanged(),
    map((status) => status === 'INVALID' ? this.longitudeFormCtrl.errors : undefined),
    map((errors) => errors?.['required'] ? 'Longitude is required' :
      errors?.['min'] ? `Longitude min value is ${LongitudeRange.MIN}` :
      errors?.['max'] ? `Longitude max value is ${LongitudeRange.MAX}` : undefined,
    ),
  );

  @Input() data: LocationBookmarkPayload | null = null;

  @Output() locationBookmartFormSubmit = new EventEmitter<LocationBookmarkPayload>();
  @Output() locationBookmarkFormCancel = new EventEmitter<void>();

  ngOnInit() {
    if (!this.data) { return; }
    this.locationBookmarkForm.setValue(this.data);
  }

  emitLocationBookmarkFormValue() {
    if (this.locationBookmarkForm.invalid) {
      return;
    }
    this.locationBookmartFormSubmit.emit(this.locationBookmarkForm.getRawValue());
  }

  emitCancel() {
    this.locationBookmarkFormCancel.emit();
  }
}
