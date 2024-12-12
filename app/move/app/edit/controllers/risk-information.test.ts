import { expect } from 'chai'
import sinon from 'sinon'

import UpdateRiskController from './risk-information'

describe('UpdateRiskController', function () {
  let controller: UpdateRiskController

  beforeEach(function () {
    // @ts-expect-error The constructor params are not properly inherited
    controller = new UpdateRiskController({ route: '/' })
  })

  afterEach(function () {
    sinon.restore()
  })

  describe('#processFields', function () {
    it('should process the fields correctly', function () {
      const fields = {
        risk: {
          items: [
            {
              value: 'escape',
              text: 'Escape',
            },
          ],
        },
      }
      const expectedFields = {
        risk: {
          items: [
            {
              value: 'escape',
              text: 'Escape',
            },
            {
              divider: 'or',
            },
            {
              behaviour: 'exclusive',
              text: 'No, there are no risks with moving this person',
              value: 'none',
            },
          ],
          validate: [
            {
              message: 'Select if there are risks with moving this person',
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
