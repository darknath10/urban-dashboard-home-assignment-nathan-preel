import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { BookmarkedLocation } from '../core/models';

@Component({
  selector: 'lba-bookmarked-locations-list',
  template: `
    <mat-selection-list [multiple]="false">
      <mat-list-item *ngIf="!locations?.length">No locations bookmarked yet</mat-list-item>
      <mat-list-option *ngFor="let location of locations"
        [value]="location.id"
        (selectedChange)="locationSelectionChange.emit({id: location.id})">
        <div class="flex justify-between items-center w-full">
          <span class="text-lg">{{location.name}}</span>
          <div>
            <button type="button" mat-icon-button color="primary" (click)="editBtnClick.emit(location)">
              <mat-icon>edit</mat-icon>
            </button>
            <button type="button" mat-icon-button color="warn" (click)="deleteBtnClick.emit({id: location.id})">
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </div>
      </mat-list-option>
    </mat-selection-list>
  `,
  styles: [
    `
      :host {
        @apply block;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarkedLocationsListComponent {
  @Input() locations: BookmarkedLocation[] | null = [];
  @Output() deleteBtnClick = new EventEmitter<{id: number}>();
  @Output() locationSelectionChange = new EventEmitter<{id: number}>();
  @Output() editBtnClick = new EventEmitter<BookmarkedLocation>();
}
