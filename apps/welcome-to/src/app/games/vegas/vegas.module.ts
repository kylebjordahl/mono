import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import * as fromProperties from './state/properties/properties.reducer'
import { PropertiesEffects } from './state/properties/properties.effects'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { environment } from '../../../environments/environment'
import { VegasPropertyComponent } from './components/vegas-property/vegas-property.component'
import { CityComponent } from './components/city/city.component'
import { FlexLayoutModule } from '@angular/flex-layout'
import { localStorageSync } from 'ngrx-store-localstorage'
import * as fromScoring from './state/scoring/scoring.reducer'
import { ScoringComponent } from './components/scoring/scoring.component'
import { ScoringEffects } from './state/scoring/scoring.effects'

@NgModule({
  declarations: [VegasPropertyComponent, CityComponent, ScoringComponent],
  imports: [
    FormsModule,
    FlexLayoutModule,
    CommonModule,
    StoreModule.forFeature(
      fromProperties.PROPERTIES_FEATURE_KEY,
      fromProperties.propertiesReducer
    ),
    StoreModule.forFeature(
      fromScoring.SCORING_FEATURE_KEY,
      fromScoring.scoringReducer
    ),
    EffectsModule.forFeature([PropertiesEffects, ScoringEffects]),
    StoreModule.forRoot(
      {},
      {
        metaReducers: !environment.production
          ? [
              localStorageSync({
                keys: [
                  fromProperties.PROPERTIES_FEATURE_KEY,
                  fromScoring.SCORING_FEATURE_KEY,
                ],
                rehydrate: true,
              }),
            ]
          : [],
        runtimeChecks: {
          strictActionImmutability: true,
          strictStateImmutability: true,
        },
      }
    ),
    EffectsModule.forRoot([]),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
  ],
  exports: [CityComponent, ScoringComponent],
})
export class VegasModule {}
