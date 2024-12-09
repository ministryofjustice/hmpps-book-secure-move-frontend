import { expect } from 'chai'
import sinon from 'sinon'

import UpdateHealthController from './health-information'

describe('UpdateHealthController', function () {
  let controller: UpdateHealthController

  beforeEach(function () {
    // @ts-expect-error The constructor params are not properly inherited
    controller = new UpdateHealthController({ route: '/' })
  })

  afterEach(function () {
    sinon.restore()
  })

  describe('#processFields', function () {
    it('should process the fields correctly', function () {
      const fields = {
        health: {
          items: [
            {
              value: 'wheelchair',
              text: 'Wheelchair',
            },
          ],
        },
      }
      const expectedFields = {
        health: {
          items: [
            {
              value: 'wheelchair',
              text: 'Wheelchair',
            },
            {
              divider: 'or',
            },
            {
              behaviour: 'exclusive',
              text: 'No, their health doesn’t affect transport',
              value: 'none',
            },
          ],
          validate: [
            {
              message: 'Select if this person’s health affects transport',
              type: 'required',
            },
          ],
        },
      }

      const result = controller.processFields(fields)

      expect(result).to.deep.equal(expectedFields)
    })
  })
})
