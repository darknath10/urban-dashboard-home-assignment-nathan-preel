import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import * as L from 'leaflet';
import { fromEvent, Subject, takeUntil, tap } from 'rxjs';
import { Coordinates } from '@lba/common/types';
import { MapConfig, MAP_CONFIG_TOKEN } from './config';
import { LocationToMark } from './location-to-mark';

const MapMarkerIcon = L.Icon.extend({
  options: {
    iconUrl: './assets/location_on.svg',
    iconAnchor: [12, 24],
  },
});

@Component({
  selector: 'lba-map',
  template: `
    <div #mapContainer class="w-full h-full"></div>
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
export class MapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: true }) private readonly mapContainerElementRef!: ElementRef<HTMLDivElement>;

  private map!: L.Map;
  private readonly fromMapClick = (map: L.Map) => fromEvent<L.LeafletMouseEvent>(map, 'click').pipe(
    tap(({latlng: {lat, lng}}) => this.zone.run(() => this.mapClick.emit({lat, lng}))),
  );

  private markersLayerGroup = L.layerGroup();

  @Input() set markers(locationsToMark: LocationToMark[] | null) {
    if (!locationsToMark) { return; }
    this.markersLayerGroup.clearLayers();
    const markers = locationsToMark.map(({name: title, coordinates: {lat, lng}}) => L.marker({lat, lng}, { icon: new MapMarkerIcon(), title }));
    markers.forEach((marker) => this.markersLayerGroup.addLayer(marker));
  }
  
  @Input() set selectedMarker(coordinates: Coordinates | null) {
    if (!coordinates || !this.map) { return; }
    this.map.flyTo(coordinates, undefined, {});
  }
  
  @Output() mapClick = new EventEmitter<Coordinates>();
  
  private readonly destroyedSubject = new Subject<void>();
  private readonly destroyed$ = this.destroyedSubject.asObservable();

  constructor(
    private readonly zone: NgZone,
    @Inject(MAP_CONFIG_TOKEN) private readonly mapConfig: MapConfig,
  ) {}

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      this.initializeMap();
      this.fromMapClick(this.map).pipe(takeUntil(this.destroyed$)).subscribe();
    });
  }

  ngOnDestroy() {
    this.destroyedSubject.next();
    this.destroyedSubject.complete();
  }

  private initializeMap() {
    const {initialCenter, initialZoomLevel} = this.mapConfig;
    this.map = L.map(this.mapContainerElementRef.nativeElement, { zoomControl: false }).setView(initialCenter, initialZoomLevel);
    L.tileLayer(this.mapConfig.tileLayerTemplateUrl).addTo(this.map);
    this.markersLayerGroup.addTo(this.map);
  }
}
