import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppComponent } from './app.component'
import { VegasModule } from './games/vegas/vegas.module'
import { FlexLayoutModule } from '@angular/flex-layout'

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, VegasModule, FlexLayoutModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
