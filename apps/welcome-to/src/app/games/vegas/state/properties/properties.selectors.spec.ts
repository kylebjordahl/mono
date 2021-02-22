import { PropertiesEntity } from './properties.models'
import { State, propertiesAdapter, initialState } from './properties.reducer'
import * as PropertiesSelectors from './properties.selectors'

describe('Properties Selectors', () => {
  const ERROR_MSG = 'No Error Available'
  const getPropertiesId = (it) => it['id']
  const createPropertiesEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as PropertiesEntity)

  let state

  beforeEach(() => {
    state = {
      properties: propertiesAdapter.setAll(
        [
          createPropertiesEntity('PRODUCT-AAA'),
          createPropertiesEntity('PRODUCT-BBB'),
          createPropertiesEntity('PRODUCT-CCC'),
        ],
        {
          ...initialState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true,
        }
      ),
    }
  })

  describe('Properties Selectors', () => {
    it('getAllProperties() should return the list of Properties', () => {
      const results = PropertiesSelectors.getAllProperties(state)
      const selId = getPropertiesId(results[1])

      expect(results.length).toBe(3)
      expect(selId).toBe('PRODUCT-BBB')
    })

    it('getSelected() should return the selected Entity', () => {
      const result = PropertiesSelectors.getSelected(state)
      const selId = getPropertiesId(result)

      expect(selId).toBe('PRODUCT-BBB')
    })

    it("getPropertiesLoaded() should return the current 'loaded' status", () => {
      const result = PropertiesSelectors.getPropertiesLoaded(state)

      expect(result).toBe(true)
    })

    it("getPropertiesError() should return the current 'error' state", () => {
      const result = PropertiesSelectors.getPropertiesError(state)

      expect(result).toBe(ERROR_MSG)
    })
  })
})
