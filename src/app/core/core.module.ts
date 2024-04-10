import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { MapModule } from '@lba/map';
import { environment } from '../../environments/environment';
import { APP_ROUTES } from './app.routes';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(APP_ROUTES),
    MapModule.forRoot(environment.mapConfig),
  ],
  declarations: [
    AppComponent,
  ],
  exports: [
    AppComponent,
  ],
})
export class CoreModule { }
