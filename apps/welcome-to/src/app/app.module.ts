import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppComponent } from './app.component'
import { VegasModule } from './games/vegas/vegas.module'

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, VegasModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
