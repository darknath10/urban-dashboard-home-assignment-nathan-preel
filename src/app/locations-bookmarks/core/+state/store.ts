import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, map, shareReplay } from 'rxjs';
import { BookmarkedLocation, LocationBookmarkPayload } from '../models'

type State = {
  locations: BookmarkedLocation[];
  selectedLocationId: BookmarkedLocation['id'] | null;
};

const INITIAL_STATE: State = {
  locations: [],
  selectedLocationId: null,
};

@Injectable()
export class LocationsBookmarksStore {
  readonly #state = new BehaviorSubject(INITIAL_STATE);

  readonly locations$ = this.#state.asObservable().pipe(
    map(({locations}) => locations),
    distinctUntilChanged(),
    shareReplay(1),
  );

  readonly selectedLocation$ = this.#state.asObservable().pipe(
    map(({locations, selectedLocationId}) => locations.find(({id}) => id === selectedLocationId)),
    distinctUntilChanged(),
    shareReplay(1),
  );

  addLocation(newLocation: LocationBookmarkPayload) {
    const currentState = this.#state.value;
    const {locations} = currentState;
    const { length, [length - 1]: last} = locations;
    this.#state.next({...currentState, locations: [...locations, {id: (last?.id ?? 0) + 1, ...newLocation}]});
  }

  editLocation(id: number, payload: LocationBookmarkPayload) {
    const currentState = this.#state.value;
    const {locations} = currentState;
    this.#state.next({...currentState, locations: locations.map((loc) => loc.id !== id ? loc : {...loc, ...payload})});
  }

  removeLocation(locationId: number) {
    const currentState = this.#state.value;
    const {locations} = currentState;
    this.#state.next({...currentState, locations: locations.filter(({id}) => id !== locationId)});
  }

  setSelectedLocationId(selectedLocationId: number | null) {
    const currentState = this.#state.value;
    this.#state.next({...currentState, selectedLocationId});
  }
}
