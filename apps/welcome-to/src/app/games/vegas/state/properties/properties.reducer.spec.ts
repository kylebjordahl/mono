import { PropertiesEntity } from './properties.models'
import * as PropertiesActions from './properties.actions'
import { State, initialState, reducer } from './properties.reducer'

describe('Properties Reducer', () => {
  const createPropertiesEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as PropertiesEntity)

  beforeEach(() => {})

  describe('valid Properties actions', () => {
    it('loadPropertiesSuccess should return set the list of known Properties', () => {
      const properties = [
        createPropertiesEntity('PRODUCT-AAA'),
        createPropertiesEntity('PRODUCT-zzz'),
      ]
      const action = PropertiesActions.loadPropertiesSuccess({ properties })

      const result: State = reducer(initialState, action)

      expect(result.loaded).toBe(true)
      expect(result.ids.length).toBe(2)
    })
  })

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any

      const result = reducer(initialState, action)

      expect(result).toBe(initialState)
    })
  })
})
