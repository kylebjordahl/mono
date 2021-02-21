import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { NavComponent } from './components/nav/nav.component';
import { AbilityModule } from '@casl/angular';
import { Ability, PureAbility } from '@casl/ability';

@NgModule({
  declarations: [AppComponent, LoginComponent, NavComponent],
  imports: [BrowserModule, FormsModule, AbilityModule],
  providers: [
    { provide: Ability, useValue: new Ability() },
    {
      provide: PureAbility,
      useExisting: Ability,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
