const moveService = require('../../common/services/move')

const middleware = require('./middleware')

const mockRequestedMoves = [
  { foo: 'bar', status: 'requested' },
  { fizz: 'buzz', status: 'requested' },
]
const mockCancelledMoves = [
  { foo: 'bar', status: 'cancelled' },
  { fizz: 'buzz', status: 'cancelled' },
]
const mockUserLocations = [
  {
    id: '9b56ca31-222b-4522-9d65-4ef429f9081e',
    title: 'Barnstaple Crown Court',
  },
  {
    id: '2c952ca0-f750-4ac3-ac76-fb631445f974',
    title: 'Axminster Crown Court',
  },
]
const errorStub = new Error('Problem')

describe('Moves middleware', function() {
  describe('#redirectBaseUrl', function() {
    const mockMoveDate = '2019-10-10'
    let req, res

    beforeEach(function() {
      this.clock = sinon.useFakeTimers(new Date(mockMoveDate).getTime())
      req = {
        baseUrl: '/moves',
        session: {},
      }
      res = {
        redirect: sinon.stub(),
      }
    })

    afterEach(function() {
      this.clock.restore()
    })

    context('with current location', function() {
      const mockLocationId = 'c249ed09-0cd5-4f52-8aee-0506e2dc7579'

      beforeEach(function() {
        req.session.currentLocation = {
          id: mockLocationId,
        }

        middleware.redirectBaseUrl(req, res)
      })

      it('should redirect to moves by location', function() {
        expect(res.redirect).to.have.been.calledOnceWithExactly(
          `/moves/${mockMoveDate}/${mockLocationId}`
        )
      })
    })

    context('without current location', function() {
      beforeEach(function() {
        middleware.redirectBaseUrl(req, res)
      })

      it('should redirect to moves without location', function() {
        expect(res.redirect).to.have.been.calledOnceWithExactly(
          `/moves/${mockMoveDate}`
        )
      })
    })
  })

  describe('#saveUrl()', function() {
    let req, nextSpy
    beforeEach(function() {
      req = {
        originalUrl: '/moves/original/url',
        session: {},
      }
      nextSpy = sinon.spy()

      middleware.saveUrl(req, {}, nextSpy)
    })

    it('should save url to session', function() {
      expect(req.session).to.have.property('movesUrl')
      expect(req.session.movesUrl).to.equal(req.originalUrl)
    })

    it('should call next', function() {
      expect(nextSpy).to.be.calledOnceWithExactly()
    })
  })

  describe('#setMoveDate()', function() {
    let req, res, nextSpy

    beforeEach(function() {
      req = {}
      res = {
        locals: {},
        redirect: sinon.stub(),
      }
      nextSpy = sinon.spy()
    })

    context('with valid move date', function() {
      beforeEach(function() {
        middleware.setMoveDate(req, res, nextSpy, '2019-10-10')
      })

      it('should set move date to query value', function() {
        expect(res.locals).to.have.property('moveDate')
        expect(res.locals.moveDate).to.equal('2019-10-10')
      })

      it('should call next', function() {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('with invalid move date', function() {
      beforeEach(function() {
        req.baseUrl = '/req-base'

        middleware.setMoveDate(req, res, nextSpy, 'Invalid date')
      })

      it('should redirect to base url', function() {
        expect(res.redirect).to.be.calledOnceWithExactly('/req-base')
      })

      it('should not set move date', function() {
        expect(res.locals).not.to.have.property('moveDate')
      })

      it('should not call next', function() {
        expect(nextSpy).not.to.be.called
      })
    })
  })

  describe('#setFromLocation()', function() {
    let req, res, nextSpy
    const locationId = '7ebc8717-ff5b-4be0-8515-3e308e92700f'

    beforeEach(function() {
      res = { locals: {} }
      req = {
        query: {},
        session: {},
      }
      nextSpy = sinon.spy()
    })

    context('when location exists in users locations', function() {
      beforeEach(function() {
        req.session.user = {
          locations: [
            {
              id: locationId,
            },
          ],
        }

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

    context('when location does not exist in users locations', function() {
      beforeEach(function() {
        middleware.setFromLocation(req, res, nextSpy, locationId)
      })

      it('should not set from location to locals', function() {
        expect(res.locals).not.to.have.property('fromLocationId')
      })

      it('should call next with 404 error', function() {
        const error = nextSpy.args[0][0]

        expect(nextSpy).to.be.calledOnce

        expect(error).to.be.an('error')
        expect(error.message).to.equal('Location not found')
        expect(error.statusCode).to.equal(404)
      })
    })
  })

  describe('#setPagination()', function() {
    const mockMoveDate = '2019-10-10'
    let req, res, nextSpy

    beforeEach(function() {
      this.clock = sinon.useFakeTimers(new Date(mockMoveDate).getTime())
      res = {
        locals: {
          moveDate: mockMoveDate,
        },
      }
      req = {
        baseUrl: '/moves',
        params: {},
      }
      nextSpy = sinon.spy()
    })

    afterEach(function() {
      this.clock.restore()
    })

    context('without location ID', function() {
      beforeEach(function() {
        middleware.setPagination(req, res, nextSpy)
      })

      it('should contain pagination on locals', function() {
        expect(res.locals).to.have.property('pagination')
      })

      it('should set correct today link', function() {
        expect(res.locals.pagination.todayUrl).to.equal('/moves/2019-10-10/')
      })

      it('should set correct next link', function() {
        expect(res.locals.pagination.nextUrl).to.equal('/moves/2019-10-11/')
      })

      it('should set correct previous link', function() {
        expect(res.locals.pagination.prevUrl).to.equal('/moves/2019-10-09/')
      })

      it('should call next', function() {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('with location ID', function() {
      beforeEach(function() {
        req.params.locationId = '12345'
        middleware.setPagination(req, res, nextSpy)
      })

      it('should contain pagination on locals', function() {
        expect(res.locals).to.have.property('pagination')
      })

      it('should set correct today link', function() {
        expect(res.locals.pagination.todayUrl).to.equal(
          '/moves/2019-10-10/12345'
        )
      })

      it('should set correct next link', function() {
        expect(res.locals.pagination.nextUrl).to.equal(
          '/moves/2019-10-11/12345'
        )
      })

      it('should set correct previous link', function() {
        expect(res.locals.pagination.prevUrl).to.equal(
          '/moves/2019-10-09/12345'
        )
      })

      it('should call next', function() {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })
  })

  describe('#setMovesByDate()', function() {
    let res, nextSpy
    const mockCurrentLocation = '5555'

    beforeEach(async function() {
      sinon.stub(moveService, 'getRequested')
      sinon.stub(moveService, 'getCancelled')
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
        expect(moveService.getRequested).not.to.be.called
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
          },
        }
      })

      context('when API call returns successfully', function() {
        beforeEach(function() {
          moveService.getRequested.resolves(mockRequestedMoves)
          moveService.getCancelled.resolves(mockCancelledMoves)
        })

        context('without location ID', function() {
          let req

          beforeEach(function() {
            req = {
              session: {
                user: {},
              },
            }
          })

          context('without user locations', function() {
            beforeEach(async function() {
              await middleware.setMovesByDate(req, res, nextSpy)
            })

            it('should call API with move date and empty locations', function() {
              expect(moveService.getRequested).to.be.calledOnceWithExactly({
                moveDate: res.locals.moveDate,
                fromLocationId: '',
              })
              expect(moveService.getCancelled).to.be.calledOnceWithExactly({
                moveDate: res.locals.moveDate,
                fromLocationId: '',
              })
            })
          })

          context('with user locations', function() {
            beforeEach(async function() {
              req.session.user.locations = mockUserLocations
              await middleware.setMovesByDate(req, res, nextSpy)
            })

            it("should call API with move date and list of user's locations", function() {
              expect(moveService.getRequested).to.be.calledOnceWithExactly({
                moveDate: res.locals.moveDate,
                fromLocationId: `${mockUserLocations[0].id},${mockUserLocations[1].id}`,
              })
              expect(moveService.getCancelled).to.be.calledOnceWithExactly({
                moveDate: res.locals.moveDate,
                fromLocationId: `${mockUserLocations[0].id},${mockUserLocations[1].id}`,
              })
            })
          })
          context('when locations exceeds 50', function() {
            beforeEach(async function() {
              req.session.user.locations = Array(75)
                .fill()
                .map((v, i) => {
                  return { id: i, title: `Mock location ${i}` }
                })

              await middleware.setMovesByDate(req, res, nextSpy)
            })
            it('should call the API with batches of 50 locations', function() {
              expect(req.session.user.locations).to.have.length(75)
              expect(moveService.getRequested).to.have.callCount(2)
              expect(moveService.getRequested).to.be.calledWithExactly({
                moveDate: res.locals.moveDate,
                fromLocationId: req.session.user.locations
                  .map(location => location.id)
                  .slice(0, 50)
                  .join(','),
              })
              expect(moveService.getRequested).to.be.calledWithExactly({
                moveDate: res.locals.moveDate,
                fromLocationId: req.session.user.locations
                  .map(location => location.id)
                  .slice(50)
                  .join(','),
              })

              expect(moveService.getCancelled).to.have.callCount(2)
              expect(moveService.getCancelled).to.be.calledWithExactly({
                moveDate: res.locals.moveDate,
                fromLocationId: req.session.user.locations
                  .map(location => location.id)
                  .slice(0, 50)
                  .join(','),
              })
              expect(moveService.getCancelled).to.be.calledWithExactly({
                moveDate: res.locals.moveDate,
                fromLocationId: req.session.user.locations
                  .map(location => location.id)
                  .slice(50)
                  .join(','),
              })
            })
            it('should set requested moves on locals', function() {
              expect(res.locals).to.have.property('requestedMovesByDate')
              expect(res.locals.requestedMovesByDate).to.deep.equal([
                ...mockRequestedMoves,
                ...mockRequestedMoves,
              ])
            })

            it('should set cancelled moves on locals', function() {
              expect(res.locals).to.have.property('cancelledMovesByDate')
              expect(res.locals.cancelledMovesByDate).to.deep.equal([
                ...mockCancelledMoves,
                ...mockCancelledMoves,
              ])
            })
          })
        })

        context('with location ID', function() {
          beforeEach(async function() {
            res.locals.fromLocationId = mockCurrentLocation
            await middleware.setMovesByDate({}, res, nextSpy)
          })

          it('should call API with move date and location ID', function() {
            expect(moveService.getRequested).to.be.calledOnceWithExactly({
              moveDate: res.locals.moveDate,
              fromLocationId: res.locals.fromLocationId,
            })
            expect(moveService.getCancelled).to.be.calledOnceWithExactly({
              moveDate: res.locals.moveDate,
              fromLocationId: res.locals.fromLocationId,
            })
          })

          it('should set requested moves on locals', function() {
            expect(res.locals).to.have.property('requestedMovesByDate')
            expect(res.locals.requestedMovesByDate).to.deep.equal(
              mockRequestedMoves
            )
          })

          it('should set cancelled moves on locals', function() {
            expect(res.locals).to.have.property('cancelledMovesByDate')
            expect(res.locals.cancelledMovesByDate).to.deep.equal(
              mockCancelledMoves
            )
          })

          it('should call next with no argument', function() {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })
        })
      })

      context('when API call returns an error', function() {
        beforeEach(async function() {
          moveService.getRequested.throws(errorStub)
          await middleware.setMovesByDate({}, res, nextSpy)
        })

        it('should not set locals properties', function() {
          expect(res.locals).not.to.have.property('requestedMovesByDate')
          expect(res.locals).not.to.have.property('cancelledMovesByDate')
        })

        it('should send error to next function', function() {
          expect(nextSpy).to.be.calledOnceWithExactly(errorStub)
        })
      })
    })
  })
})
