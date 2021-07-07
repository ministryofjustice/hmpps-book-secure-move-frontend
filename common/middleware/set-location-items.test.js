const referenceDataHelpers = require('../helpers/reference-data')

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
const courtsMock2 = [
  {
    id: '8888-dupe',
    title: 'Court 8888',
  },
  {
    id: '7777',
    title: 'Court 7777',
  },
  {
    id: 'aaaa',
    title: 'Court AAAA',
  },
]

describe('#setLocationItems()', function () {
  let req, res, nextSpy, referenceDataService

  beforeEach(function () {
    referenceDataService = {
      getLocationsByType: sinon.stub().resolves(courtsMock),
    }
    req = {
      form: {
        options: {
          fields: {
            to_location_court: {},
          },
        },
      },
      services: {
        referenceData: referenceDataService,
      },
    }
    res = {}
    nextSpy = sinon.spy()

    sinon.stub(referenceDataHelpers, 'filterDisabled').callsFake(() => {
      return () => true
    })
  })

  context('when field exists', function () {
    const mockFieldName = 'to_location_court'
    const mockLocationType = 'court'

    context('when service resolves', function () {
      beforeEach(async function () {
        await setLocationItems(mockLocationType, mockFieldName)(
          req,
          {},
          nextSpy
        )
      })

      it('should call reference data service', function () {
        expect(
          referenceDataService.getLocationsByType
        ).to.be.calledOnceWithExactly([mockLocationType])
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
        req.services.referenceData.getLocationsByType = sinon
          .stub()
          .throws(errorMock)

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
          services: {
            referenceData: referenceDataService,
          },
        })
      })
    })
  })

  context(
    'when field exists and multiple location types are to be used',
    function () {
      const mockFieldName = 'to_location_court'
      const mockLocationType = ['court', 'hospital']

      context('when service resolves', function () {
        beforeEach(async function () {
          req.services.referenceData.getLocationsByType = sinon
            .stub()
            .resolves(courtsMock.concat(courtsMock2))

          await setLocationItems(mockLocationType, mockFieldName)(
            req,
            {},
            nextSpy
          )
        })

        it('should call reference data service for the location types', function () {
          expect(
            referenceDataService.getLocationsByType
          ).to.be.calledOnceWithExactly(mockLocationType)
        })

        it('populates the move type items', function () {
          expect(req.form.options.fields[mockFieldName].items).to.deep.equal([
            {
              text: `--- Choose ${mockLocationType[0]} ---`,
            },
            {
              text: 'Court 8888',
              value: '8888',
            },
            {
              text: 'Court 9999',
              value: '9999',
            },
            {
              text: 'Court 8888',
              value: '8888-dupe',
            },
            {
              text: 'Court 7777',
              value: '7777',
            },
            {
              text: 'Court AAAA',
              value: 'aaaa',
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
          req.services.referenceData.getLocationsByType = sinon
            .stub()
            .throws(errorMock)

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
            services: {
              referenceData: referenceDataService,
            },
          })
        })
      })
    }
  )

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
