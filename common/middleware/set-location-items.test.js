const referenceDataHelpers = require('../helpers/reference-data')
const referenceDataService = require('../services/reference-data')

const setLocationItems = require('./set-location-items')
const courtsMock = [
  {
    id: '8888',
    title: 'Court 8888',
  },
  {
    id: '9999',
    title: 'Court 9999',
  },
]

describe('#setLocationItems()', function () {
  let req, res, nextSpy

  beforeEach(function () {
    req = {
      form: {
        options: {
          fields: {
            to_location_court: {},
          },
        },
      },
    }
    res = {}
    nextSpy = sinon.spy()

    sinon.stub(referenceDataHelpers, 'filterDisabled').callsFake(() => {
      return () => true
    })
    sinon.stub(referenceDataService, 'getLocationsByType')
  })

  context('when field exists', function () {
    const mockFieldName = 'to_location_court'
    const mockLocationType = 'court'

    context('when service resolves', function () {
      beforeEach(async function () {
        referenceDataService.getLocationsByType.resolves(courtsMock)

        await setLocationItems(mockLocationType, mockFieldName)(
          req,
          {},
          nextSpy
        )
      })

      it('should call reference data service', function () {
        expect(
          referenceDataService.getLocationsByType
        ).to.be.calledOnceWithExactly(mockLocationType)
      })

      it('populates the move type items', function () {
        expect(req.form.options.fields[mockFieldName].items).to.deep.equal([
          {
            text: `--- Choose ${mockLocationType} ---`,
          },
          {
            text: 'Court 8888',
            value: '8888',
          },
          {
            text: 'Court 9999',
            value: '9999',
          },
        ])
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('when service rejects', function () {
      const errorMock = new Error('Problem')

      beforeEach(async function () {
        referenceDataService.getLocationsByType.throws(errorMock)

        await setLocationItems(mockLocationType, mockFieldName)(
          req,
          {},
          nextSpy
        )
      })

      it('should call next with the error', function () {
        expect(nextSpy).to.be.calledOnceWithExactly(errorMock)
      })

      it('should not mutate request object', function () {
        expect(req).to.deep.equal({
          form: {
            options: {
              fields: {
                to_location_court: {},
              },
            },
          },
        })
      })
    })
  })

  context('when field does not exist', function () {
    beforeEach(async function () {
      await setLocationItems('court', 'non_existent')(req, res, nextSpy)
    })

    it('should not call reference service', function () {
      expect(referenceDataService.getLocationsByType).not.to.be.called
    })

    it('should call next', function () {
      expect(nextSpy).to.be.calledOnceWithExactly()
    })
  })
})
