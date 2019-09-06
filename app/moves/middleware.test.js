const moveService = require('../../common/services/move')
const permissions = require('../../common/middleware/permissions')

const middleware = require('./middleware')

const movesStub = [{ foo: 'bar' }, { fizz: 'buzz' }]
const errorStub = new Error('Problem')

describe('Moves middleware', function() {
  describe('#redirectUsers()', function() {
    let req, res, nextSpy

    beforeEach(function() {
      sinon.stub(permissions, 'check')
      nextSpy = sinon.spy()
      req = {
        baseUrl: '/moves',
      }
      res = {
        redirect: sinon.stub(),
      }
    })

    context('when user has view all moves permission', function() {
      beforeEach(function() {
        req.session = {
          user: {
            permissions: ['moves:view:all'],
          },
        }

        permissions.check
          .withArgs('moves:view:all', ['moves:view:all'])
          .returns(true)

        middleware.redirectUsers(req, res, nextSpy)
      })

      it('should call next', function() {
        expect(nextSpy).to.have.been.calledOnceWithExactly()
      })
    })

    context('when user has view by location permission', function() {
      beforeEach(function() {
        req.session = {
          user: {
            permissions: ['moves:view:by_location'],
          },
        }

        permissions.check
          .withArgs('moves:view:by_location', ['moves:view:by_location'])
          .returns(true)
      })

      context('when current location exists', function() {
        const mockLocationId = 'c249ed09-0cd5-4f52-8aee-0506e2dc7579'

        beforeEach(function() {
          req.session.currentLocation = {
            id: mockLocationId,
          }
        })

        context('when current request contains search', function() {
          beforeEach(function() {
            req.query = {
              'move-date': '2019-10-10',
            }
            middleware.redirectUsers(req, res, nextSpy)
          })

          it('should redirect to moves by location', function() {
            expect(res.redirect).to.have.been.calledOnceWithExactly(
              `/moves/${mockLocationId}?move-date=2019-10-10`
            )
          })

          it('should not call next', function() {
            expect(nextSpy).not.to.have.been.called
          })
        })

        context('when current request does not contain search', function() {
          beforeEach(function() {
            middleware.redirectUsers(req, res, nextSpy)
          })

          it('should redirect to moves by location', function() {
            expect(res.redirect).to.have.been.calledOnceWithExactly(
              `/moves/${mockLocationId}`
            )
          })

          it('should not call next', function() {
            expect(nextSpy).not.to.have.been.called
          })
        })
      })

      context('when current location is missing', function() {
        beforeEach(function() {
          middleware.redirectUsers(req, res, nextSpy)
        })

        it('should not redirect', function() {
          expect(res.redirect).not.to.have.been.called
        })

        it('should call next', function() {
          expect(nextSpy).to.have.been.calledOnceWithExactly()
        })
      })
    })

    context('when user has no matching permissions', function() {
      beforeEach(function() {
        middleware.redirectUsers(req, res, nextSpy)
      })

      it('should not redirect', function() {
        expect(res.redirect).not.to.have.been.called
      })

      it('should call next', function() {
        expect(nextSpy).to.have.been.calledOnceWithExactly()
      })
    })
  })

  describe('#storeQuery()', function() {
    let req, nextSpy

    context('with empty request query', function() {
      beforeEach(function() {
        req = {
          query: {},
          session: {},
        }
        nextSpy = sinon.spy()

        middleware.storeQuery(req, {}, nextSpy)
      })

      it('should update session correctly', function() {
        expect(req.session).to.have.property('movesQuery')
        expect(req.session.movesQuery).to.deep.equal({})
      })

      it('should call next', function() {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('with non empty request query', function() {
      beforeEach(function() {
        req = {
          query: {
            'move-date': '2019-10-10',
          },
          session: {},
        }
        nextSpy = sinon.spy()

        middleware.storeQuery(req, {}, nextSpy)
      })

      it('should update session correctly', function() {
        expect(req.session).to.have.property('movesQuery')
        expect(req.session.movesQuery).to.deep.equal({
          'move-date': '2019-10-10',
        })
      })

      it('should call next', function() {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })
  })

  describe('#setMoveDate()', function() {
    let req, res, nextSpy

    beforeEach(function() {
      res = { locals: {} }
      nextSpy = sinon.spy()
    })

    context('when no move date exists in query', function() {
      const mockDate = '2019-08-10'

      beforeEach(function() {
        this.clock = sinon.useFakeTimers(new Date(mockDate).getTime())

        req = { query: {} }

        middleware.setMoveDate(req, res, nextSpy)
      })

      afterEach(function() {
        this.clock.restore()
      })

      it('should set move date to current date', function() {
        expect(res.locals).to.have.property('moveDate')
        expect(res.locals.moveDate).to.equal('2019-08-10')
      })

      it('should call next', function() {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('when move date exists in query', function() {
      beforeEach(function() {
        req = {
          query: {
            'move-date': '2019-10-10',
          },
        }

        middleware.setMoveDate(req, res, nextSpy)
      })

      it('should set move date to query value', function() {
        expect(res.locals).to.have.property('moveDate')
        expect(res.locals.moveDate).to.equal('2019-10-10')
      })

      it('should call next', function() {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })
  })

  describe('#setFromLocation()', function() {
    let req, res, nextSpy
    const locationId = '7ebc8717-ff5b-4be0-8515-3e308e92700f'

    beforeEach(function() {
      res = { locals: {} }
      nextSpy = sinon.spy()
    })

    beforeEach(function() {
      req = { query: {} }

      middleware.setFromLocation(req, res, nextSpy, locationId)
    })

    it('should set from location to locals', function() {
      expect(res.locals).to.have.property('fromLocationId')
      expect(res.locals.fromLocationId).to.equal(locationId)
    })

    it('should call next', function() {
      expect(nextSpy).to.be.calledOnceWithExactly()
    })
  })

  describe('#setMovesByDate()', function() {
    let res, nextSpy
    const mockCurrentLocation = '5555'

    beforeEach(async function() {
      sinon.stub(moveService, 'getRequestedByDateAndLocation')
      nextSpy = sinon.spy()
      res = { locals: {} }
    })

    context('when no move date exists', function() {
      beforeEach(async function() {
        await middleware.setMovesByDate({}, res, nextSpy)
      })

      it('should call next with no argument', function() {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })

      it('should not call API with move date', function() {
        expect(moveService.getRequestedByDateAndLocation).not.to.be.called
      })

      it('should not set response data to locals object', function() {
        expect(res.locals).not.to.have.property('movesByDate')
      })
    })

    context('when move date exists', function() {
      beforeEach(function() {
        res = {
          locals: {
            moveDate: '2010-10-10',
            fromLocationId: mockCurrentLocation,
          },
        }
      })

      context('when API call returns succesfully', function() {
        beforeEach(async function() {
          moveService.getRequestedByDateAndLocation.resolves(movesStub)
          await middleware.setMovesByDate({}, res, nextSpy)
        })

        it('should call API with move date and location ID', function() {
          expect(
            moveService.getRequestedByDateAndLocation
          ).to.be.calledOnceWithExactly(
            res.locals.moveDate,
            res.locals.fromLocationId
          )
        })

        it('should set response to locals object', function() {
          expect(res.locals).to.have.property('movesByDate')
          expect(res.locals.movesByDate).to.equal(movesStub)
        })

        it('should call next with no argument', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('when API call returns an error', function() {
        beforeEach(async function() {
          moveService.getRequestedByDateAndLocation.throws(errorStub)
          await middleware.setMovesByDate({}, res, nextSpy)
        })

        it('should not set a value on the locals object', function() {
          expect(res.locals).not.to.have.property('movesByDate')
        })

        it('should send error to next function', function() {
          expect(nextSpy).to.be.calledOnceWithExactly(errorStub)
        })
      })
    })
  })
})
