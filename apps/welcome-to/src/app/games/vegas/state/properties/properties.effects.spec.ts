import { TestBed, async } from '@angular/core/testing'

import { Observable } from 'rxjs'

import { provideMockActions } from '@ngrx/effects/testing'
import { provideMockStore } from '@ngrx/store/testing'

import { NxModule, DataPersistence } from '@nrwl/angular'
import { hot } from '@nrwl/angular/testing'

import { PropertiesEffects } from './properties.effects'
import * as PropertiesActions from './properties.actions'

import { initialLots } from './initialProperties'

describe('PropertiesEffects', () => {
  let actions: Observable<any>
  let effects: PropertiesEffects

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NxModule.forRoot()],
      providers: [
        PropertiesEffects,
        DataPersistence,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    })

    effects = TestBed.get(PropertiesEffects)
  })

  describe('loadProperties$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: PropertiesActions.initializeProperties() })

      const expected = hot('-a-|', {
        a: PropertiesActions.loadPropertiesSuccess({
          properties: initialLots,
        }),
      })

      expect(effects.loadProperties$).toBeObservable(expected)
    })
  })
})
