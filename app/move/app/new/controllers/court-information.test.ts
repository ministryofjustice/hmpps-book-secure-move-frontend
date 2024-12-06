import { expect } from 'chai'
import sinon from 'sinon'
import CourtInformationController from './court-information'

describe('CourtInformationController', function () {
  let controller: CourtInformationController

  beforeEach(function () {
    // @ts-expect-error The constructor params are not properly inherited
    controller = new CourtInformationController({ route: '/'})
  })

  afterEach(function () {
    sinon.restore()
  })

  describe('#processFields', function () {
    it('should process the fields correctly', function () {
      const fields = {
        court: {
          items: [
            {
              value: 'solicitor',
              text: 'Solicitor',
            }
          ]
        },
      }
      const expectedFields = {
        court: {
          items: [
            {
              value: 'solicitor',
              text: 'Solicitor',
            },
            {
              divider: 'or',
            },
            {
              behaviour: 'exclusive',
              text: 'No, there is no information for the court',
              value: 'none',
            },
          ],
          validate: [
            {
              message: 'Select if there is any information for the court',
              type: 'required',
            }
          ]
        },
      }

      const result = controller.processFields(fields)

      expect(result).to.deep.equal(expectedFields)
    })
  })
})
