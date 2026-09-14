const { format } = require('date-fns')
const proxyquire = require('proxyquire').noCallThru()

const { DATE_FORMATS } = require('../../config')

const mockSetSelectedLocation = sinon.spy()

const { redirectToIncomingMoves } = proxyquire('./controllers', {
  '../locations/middleware': {
    setSelectedLocation: mockSetSelectedLocation,
  },
})

const mockLocation = {
  id: '2c952ca0-f750-4ac3-ac76-fb631445f974',
  title: 'HMP Leeds',
  nomis_agency_id: 'LDI',
}

describe('CSRA controllers', function () {
  describe('#redirectToIncomingMoves', function () {
    let req, res, nextSpy
    let mockReferenceData

    beforeEach(function () {
      mockSetSelectedLocation.resetHistory()

      mockReferenceData = {
        getLocationByNomisAgencyId: sinon.fake.returns(
          Promise.resolve(mockLocation)
        ),
      }

      req = {
        query: { agency: 'LDI' },
        session: {
          user: {
            locations: [mockLocation],
          },
        },
        services: {
          referenceData: mockReferenceData,
        },
      }
      res = {
        redirect: sinon.spy(),
      }
      nextSpy = sinon.spy()
    })

    context('when the agency resolves to a location the user can access', function () {
      beforeEach(async function () {
        await redirectToIncomingMoves(req, res, nextSpy)
      })

      it('should look up the location by the nomis agency id', function () {
        expect(
          mockReferenceData.getLocationByNomisAgencyId
        ).to.be.calledOnceWithExactly('LDI')
      })

      it('should set the resolved location as the current location', function () {
        expect(mockSetSelectedLocation).to.be.calledOnceWithExactly(
          req,
          'currentLocation',
          mockLocation
        )
      })

      it('should mark the location as selected on the session', function () {
        expect(req.session.hasSelectedLocation).to.equal(true)
      })

      it('should redirect to the incoming moves page for today', function () {
        const today = format(new Date(), DATE_FORMATS.URL_PARAM)

        expect(res.redirect).to.be.calledOnceWithExactly(
          `/moves/day/${today}/incoming`
        )
      })

      it('should not call next with an error', function () {
        expect(nextSpy).not.to.be.called
      })
    })

    context('when no agency is provided', function () {
      beforeEach(async function () {
        req.query = {}
        await redirectToIncomingMoves(req, res, nextSpy)
      })

      it('should not look up any location', function () {
        expect(mockReferenceData.getLocationByNomisAgencyId).not.to.be.called
      })

      it('should call next with a 403 error', function () {
        expect(nextSpy).to.be.calledOnce
        expect(nextSpy.args[0][0].statusCode).to.equal(403)
      })

      it('should not redirect', function () {
        expect(res.redirect).not.to.be.called
      })
    })

    context('when the agency does not match a known location', function () {
      beforeEach(async function () {
        mockReferenceData.getLocationByNomisAgencyId = sinon.fake.returns(
          Promise.resolve(undefined)
        )
        await redirectToIncomingMoves(req, res, nextSpy)
      })

      it('should call next with a 403 error', function () {
        expect(nextSpy).to.be.calledOnce
        expect(nextSpy.args[0][0].statusCode).to.equal(403)
        expect(nextSpy.args[0][0].cause).to.equal(
          'CSRA_LOCATION_INACCESSIBLE'
        )
      })

      it('should not redirect', function () {
        expect(res.redirect).not.to.be.called
      })
    })

    context(
      'when the agency resolves to a location the user cannot access',
      function () {
        beforeEach(async function () {
          req.session.user.locations = []
          await redirectToIncomingMoves(req, res, nextSpy)
        })

        it('should call next with a 403 error', function () {
          expect(nextSpy).to.be.calledOnce
          expect(nextSpy.args[0][0].statusCode).to.equal(403)
        })

        it('should not set a current location', function () {
          expect(mockSetSelectedLocation).not.to.be.called
        })

        it('should not redirect', function () {
          expect(res.redirect).not.to.be.called
        })
      }
    )

    context('when the location lookup fails', function () {
      const lookupError = new Error('API unavailable')

      beforeEach(async function () {
        mockReferenceData.getLocationByNomisAgencyId = sinon.fake.returns(
          Promise.reject(lookupError)
        )
        await redirectToIncomingMoves(req, res, nextSpy)
      })

      it('should call next with the underlying error', function () {
        expect(nextSpy).to.be.calledOnceWithExactly(lookupError)
      })

      it('should not redirect', function () {
        expect(res.redirect).not.to.be.called
      })
    })
  })
})
