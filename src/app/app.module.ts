import { NgModule } from '@angular/core';
import { AppComponent, CoreModule } from '@lba/core';

@NgModule({
  imports: [
    CoreModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
