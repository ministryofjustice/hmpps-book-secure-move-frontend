const moveService = require('../../common/services/move')
const presenters = require('../../common/presenters')

const middleware = require('./middleware')

const mockActiveMoves = [
  { id: '1', foo: 'bar', status: 'requested' },
  { id: '2', fizz: 'buzz', status: 'requested' },
  { id: '3', foo: 'bar', status: 'completed' },
  { id: '4', fizz: 'buzz', status: 'completed' },
]
const mockCancelledMoves = [
  { id: '5', foo: 'bar', status: 'cancelled' },
  { id: '6', fizz: 'buzz', status: 'cancelled' },
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
      context(
        "when user hasn't got permission to see the proposed moves",
        function() {
          context('when the location type is prison', function() {
            const mockLocation = {
              id: 'c249ed09-0cd5-4f52-8aee-0506e2dc7579',
              location_type: 'prison',
            }

            beforeEach(function() {
              req.session = {
                currentLocation: mockLocation,
                user: {
                  permissions: [],
                },
              }

              middleware.redirectBaseUrl(req, res)
            })

            it('should redirect to outgoing moves by location', function() {
              expect(res.redirect).to.have.been.calledOnceWithExactly(
                `/moves/day/${mockMoveDate}/${mockLocation.id}/outgoing`
              )
            })
          })
          context('when the location type is police', function() {
            const mockLocation = {
              id: 'c249ed09-0cd5-4f52-8aee-0506e2dc7579',
              location_type: 'police',
            }

            beforeEach(function() {
              req.session = {
                currentLocation: mockLocation,
                user: {
                  permissions: [],
                },
              }

              middleware.redirectBaseUrl(req, res)
            })

            it('should redirect to outgoing moves by location', function() {
              expect(res.redirect).to.have.been.calledOnceWithExactly(
                `/moves/day/${mockMoveDate}/${mockLocation.id}/outgoing`
              )
            })
          })
        }
      )
      context('when user has permission to see the proposed moves', function() {
        context('when location type is prison', function() {
          const mockLocation = {
            id: 'c249ed09-0cd5-4f52-8aee-0506e2dc7579',
            location_type: 'prison',
          }

          beforeEach(function() {
            req.session = {
              currentLocation: mockLocation,
              user: {
                permissions: ['moves:view:proposed'],
              },
            }

            middleware.redirectBaseUrl(req, res)
          })
          it('should redirect to the dashboard if the user can see them', function() {
            expect(res.redirect).to.have.been.calledOnceWithExactly(
              `/moves/week/${mockMoveDate}/${mockLocation.id}/`
            )
          })
        })
        context('when location type is not prison', function() {
          const mockLocation = {
            id: 'c249ed09-0cd5-4f52-8aee-0506e2dc7579',
            location_type: 'police',
          }

          beforeEach(function() {
            req.session = {
              currentLocation: mockLocation,
              user: {
                permissions: ['moves:view:proposed'],
              },
            }

            middleware.redirectBaseUrl(req, res)
          })
          it('should redirect to the outgoing move view by day', function() {
            expect(res.redirect).to.have.been.calledOnceWithExactly(
              `/moves/day/${mockMoveDate}/${mockLocation.id}/outgoing`
            )
          })
        })
      })
    })
    context('without current location', function() {
      beforeEach(function() {
        middleware.redirectBaseUrl(req, res)
      })
      context(
        "when user hasn't got permission to see the proposed moves",
        function() {
          it('should redirect to moves without location', function() {
            expect(res.redirect).to.have.been.calledOnceWithExactly(
              `/moves/day/${mockMoveDate}/outgoing`
            )
          })
        }
      )
      context('when user has permission to see the proposed moves', function() {
        beforeEach(function() {
          req.session = {
            user: {
              permissions: ['move:proposed:view'],
            },
          }
          res.redirect.resetHistory()
          middleware.redirectBaseUrl(req, res)
        })
        it('should redirect to moves without location', function() {
          expect(res.redirect).to.have.been.calledOnceWithExactly(
            `/moves/day/${mockMoveDate}/outgoing`
          )
        })
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
  describe('#setMovesByDateRangeAndStatus', function() {
    let locals
    let req
    beforeEach(function() {
      locals = {
        dateRange: ['2019-01-01', '2019-01-07'],
        status: 'proposed',
      }
      req = {
        params: {
          status: 'proposed',
          locationId: '123',
        },
      }
    })
    it('returns next if dateRange is not defined', async function() {
      locals = {}
      const next = sinon.stub()
      await middleware.setMovesByDateRangeAndStatus(req, { locals }, next)
      expect(next).to.have.been.calledOnce
    })
    it('interrogates the data service with the range of dates', async function() {
      sinon.stub(moveService, 'getMovesByDateRangeAndStatus').resolves({})
      await middleware.setMovesByDateRangeAndStatus(req, { locals }, () => {})
      expect(moveService.getMovesByDateRangeAndStatus).to.have.been.calledWith({
        dateRange: ['2019-01-01', '2019-01-07'],
        fromLocationId: '123',
        status: 'proposed',
      })
      moveService.getMovesByDateRangeAndStatus.restore()
    })
    it('in case of errors, it passes it to next()', async function() {
      sinon
        .stub(moveService, 'getMovesByDateRangeAndStatus')
        .rejects(new Error('Error!'))
      const next = sinon.stub()
      await middleware.setMovesByDateRangeAndStatus(req, { locals }, next)
      expect(next).to.have.been.calledWith(sinon.match.has('message', 'Error!'))
      moveService.getMovesByDateRangeAndStatus.restore()
    })
  })
  describe('#setPagination()', function() {
    const mockDate = '2019-10-10'
    let req, res, nextSpy

    beforeEach(function() {
      this.clock = sinon.useFakeTimers(new Date(mockDate).getTime())
      res = {
        locals: {},
      }
      req = {
        baseUrl: '/moves',
        params: {
          date: mockDate,
        },
      }
      nextSpy = sinon.spy()
    })

    afterEach(function() {
      this.clock.restore()
    })

    context('without location ID', function() {
      context('with day', function() {
        beforeEach(function() {
          req.params.period = 'day'
          middleware.setPagination(req, res, nextSpy)
        })

        it('should contain pagination on locals', function() {
          expect(res.locals).to.have.property('pagination')
        })

        it('should set correct today link', function() {
          expect(res.locals.pagination.todayUrl).to.equal(
            '/moves/day/2019-10-10'
          )
        })

        it('should set correct next link', function() {
          expect(res.locals.pagination.nextUrl).to.equal(
            '/moves/day/2019-10-11'
          )
        })

        it('should set correct previous link', function() {
          expect(res.locals.pagination.prevUrl).to.equal(
            '/moves/day/2019-10-09'
          )
        })

        it('should call next', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })
      context('with week', function() {
        beforeEach(function() {
          req.params.period = 'week'
          middleware.setPagination(req, res, nextSpy)
        })

        it('should contain pagination on locals', function() {
          expect(res.locals).to.have.property('pagination')
        })

        it('should set correct today link', function() {
          expect(res.locals.pagination.todayUrl).to.equal(
            '/moves/week/2019-10-10'
          )
        })

        it('should set correct next link', function() {
          expect(res.locals.pagination.nextUrl).to.equal(
            '/moves/week/2019-10-17'
          )
        })

        it('should set correct previous link', function() {
          expect(res.locals.pagination.prevUrl).to.equal(
            '/moves/week/2019-10-03'
          )
        })

        it('should call next', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })
    })
    context('with location ID', function() {
      context('with day', function() {
        beforeEach(function() {
          req.params.locationId = '12345'
          req.params.period = 'day'
          middleware.setPagination(req, res, nextSpy)
        })

        it('should contain pagination on locals', function() {
          expect(res.locals).to.have.property('pagination')
        })

        it('should set correct today link', function() {
          expect(res.locals.pagination.todayUrl).to.equal(
            '/moves/day/2019-10-10/12345'
          )
        })

        it('should set correct next link', function() {
          expect(res.locals.pagination.nextUrl).to.equal(
            '/moves/day/2019-10-11/12345'
          )
        })

        it('should set correct previous link', function() {
          expect(res.locals.pagination.prevUrl).to.equal(
            '/moves/day/2019-10-09/12345'
          )
        })

        it('should call next', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })
      context('with week', function() {
        beforeEach(function() {
          req.params.locationId = '12345'
          req.params.period = 'week'
          middleware.setPagination(req, res, nextSpy)
        })

        it('should contain pagination on locals', function() {
          expect(res.locals).to.have.property('pagination')
        })

        it('should set correct today link', function() {
          expect(res.locals.pagination.todayUrl).to.equal(
            '/moves/week/2019-10-10/12345'
          )
        })

        it('should set correct next link', function() {
          expect(res.locals.pagination.nextUrl).to.equal(
            '/moves/week/2019-10-17/12345'
          )
        })

        it('should set correct previous link', function() {
          expect(res.locals.pagination.prevUrl).to.equal(
            '/moves/week/2019-10-03/12345'
          )
        })

        it('should call next', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })
    })
  })

  describe('#setPagination', function() {
    const mockDateRange = ['2019-10-10', '2019-10-10']
    let req, res, nextSpy
    beforeEach(function() {
      this.clock = sinon.useFakeTimers(new Date(mockDateRange[0]).getTime())
      nextSpy = sinon.spy()
    })

    afterEach(function() {
      this.clock.restore()
    })

    context('with default values -- week as range, and no status', function() {
      beforeEach(function() {
        res = {
          locals: {},
        }
        req = {
          baseUrl: '/moves',
          params: {
            locationId: '123',
            date: '2019-10-10',
            period: 'week',
          },
        }
        nextSpy = sinon.spy()
        middleware.setPagination(req, res, nextSpy)
      })
      it('creates pagination on locals', function() {
        expect(res.locals.pagination).to.exist
      })
      it('creats correctly todayUrl', function() {
        expect(res.locals.pagination.todayUrl).to.exist
        expect(res.locals.pagination.todayUrl).to.equal(
          '/moves/week/2019-10-10/123'
        )
      })
      it('creats correctly prevUrl', function() {
        expect(res.locals.pagination.todayUrl).to.exist
        expect(res.locals.pagination.prevUrl).to.equal(
          '/moves/week/2019-10-03/123'
        )
      })
      it('creats correctly nextUrl', function() {
        expect(res.locals.pagination.nextUrl).to.exist
        expect(res.locals.pagination.nextUrl).to.equal(
          '/moves/week/2019-10-17/123'
        )
      })
    })
    context('with params -- day as range, and proposed status', function() {
      beforeEach(function() {
        res = {
          locals: {
            moveDate: mockDateRange,
          },
        }
        req = {
          baseUrl: '/moves',
          params: {
            locationId: '123',
            date: '2019-10-10',
            status: 'proposed',
            period: 'day',
          },
        }
        nextSpy = sinon.spy()
        middleware.setPagination(req, res, nextSpy)
      })
      it('creates pagination on locals', function() {
        expect(res.locals.pagination).to.exist
      })
      it('creats correctly todayUrl', function() {
        expect(res.locals.pagination.todayUrl).to.exist
        expect(res.locals.pagination.todayUrl).to.equal(
          '/moves/day/2019-10-10/123/proposed'
        )
      })
      it('creats correctly prevUrl', function() {
        expect(res.locals.pagination.todayUrl).to.exist
        expect(res.locals.pagination.prevUrl).to.equal(
          '/moves/day/2019-10-09/123/proposed'
        )
      })
      it('creats correctly nextUrl', function() {
        expect(res.locals.pagination.nextUrl).to.exist
        expect(res.locals.pagination.nextUrl).to.equal(
          '/moves/day/2019-10-11/123/proposed'
        )
      })
    })
    context('with param view instead of status', function() {
      beforeEach(function() {
        res = {
          locals: {
            moveDate: mockDateRange,
          },
        }
        req = {
          baseUrl: '/moves',
          params: {
            locationId: '123',
            date: '2019-10-10',
            view: 'dashboard',
            period: 'day',
          },
        }
        nextSpy = sinon.spy()
        middleware.setPagination(req, res, nextSpy)
      })
      it('creats correctly todayUrl', function() {
        expect(res.locals.pagination.todayUrl).to.exist
        expect(res.locals.pagination.todayUrl).to.equal(
          '/moves/day/2019-10-10/123/dashboard'
        )
      })
      it('creats correctly prevUrl', function() {
        expect(res.locals.pagination.todayUrl).to.exist
        expect(res.locals.pagination.prevUrl).to.equal(
          '/moves/day/2019-10-09/123/dashboard'
        )
      })
      it('creats correctly nextUrl', function() {
        expect(res.locals.pagination.nextUrl).to.exist
        expect(res.locals.pagination.nextUrl).to.equal(
          '/moves/day/2019-10-11/123/dashboard'
        )
      })
    })
  })

  describe('#setMoveTypeNavigation', function() {
    let next
    let req
    let res
    context('happy path', function() {
      beforeEach(async function() {
        sinon.stub(moveService, 'getMovesCount').resolves(4)
        sinon.stub(presenters, 'moveTypesToFilterComponent').returnsArg(0)
        next = sinon.spy()
        req = {
          baseUrl: '/moves',
          url: '/moves/week/2010-09-07/123/proposed',
          params: {
            locationId: '123',
            date: '2010-09-07',
            period: 'week',
          },
        }
        res = {
          locals: {
            dateRange: ['2010-09-03', '2010-09-10'],
          },
        }
        await middleware.setMoveTypeNavigation(req, res, next)
      })
      afterEach(function() {
        moveService.getMovesCount.restore()
      })
      it('sets res.locals.moveTypeNavigation', function() {
        expect({ ...res.locals }).to.deep.equal({
          dateRange: ['2010-09-03', '2010-09-10'],
          moveTypeNavigation: [
            {
              active: false,
              filter: 'proposed',
              label: 'moves::dashboard.filter.proposed',
              href: '/moves/week/2010-09-07/123/proposed',
              value: 4,
            },
            {
              active: false,
              filter: 'requested,accepted,completed',
              label: 'moves::dashboard.filter.approved',
              href: '/moves/week/2010-09-07/123/requested,accepted,completed',
              value: 4,
            },
            {
              active: false,
              filter: 'rejected',
              label: 'moves::dashboard.filter.rejected',
              href: '/moves/week/2010-09-07/123/rejected',
              value: 4,
            },
          ],
        })
      })
      it('calls next', function() {
        expect(next).to.have.been.calledWithExactly()
      })
      it('returns predictable results', async function() {
        const locals1 = { ...res.locals }
        await middleware.setMoveTypeNavigation(req, res, next)
        expect(res.locals).to.deep.equal(locals1)
      })
      it('calls the presenter on each element', async function() {
        presenters.moveTypesToFilterComponent.resetHistory()
        await middleware.setMoveTypeNavigation(req, res, next)
        expect(presenters.moveTypesToFilterComponent).to.have.been.calledThrice
      })
    })
    context('unhappy path', function() {
      it('calls next with error if needed', async function() {
        sinon.stub(moveService, 'getMovesCount').rejects(new Error('Error!'))
        next = sinon.spy()
        await middleware.setMoveTypeNavigation(
          {
            baseUrl: '/moves',
            url: '/moves/week/2010-09-07/123/proposed',
            params: {
              locationId: '123',
              date: '2010-09-07',
            },
          },
          {
            locals: {
              period: 'week',
              dateRange: ['2010-09-03', '2010-09-10'],
            },
          },
          next
        )
        expect(next).to.have.been.calledWith(
          sinon.match({
            message: 'Error!',
          })
        )
        moveService.getMovesCount.restore()
      })
    })
  })

  describe('#setDashboardMoveSummary', function() {
    context('with res.locals.moveTypeNavigation', function() {
      let locals
      const next = sinon.spy()
      beforeEach(function() {
        locals = {
          moveTypeNavigation: [
            {
              filter: 'proposed',
              value: 8,
              href: '/proposed',
            },
            {
              filter: 'rejected',
              value: 5,
              href: '/rejected',
            },
            {
              filter: 'approved',
              value: 2,
              href: '/approved',
            },
          ],
        }
        middleware.setDashboardMoveSummary({}, { locals }, next)
      })
      afterEach(function() {
        next.resetHistory()
      })
      it('adds a new type called total ', function() {
        expect(
          locals.dashboardMoveSummary.find(type => {
            return type.filter === 'total'
          })
        ).to.exist
      })
      it('maps all requested types of moves ', function() {
        expect(locals.dashboardMoveSummary.length).to.equal(3)
      })
      it('has a total value of all the moves', function() {
        expect(
          locals.dashboardMoveSummary.find(type => {
            return type.filter === 'total'
          }).value
        ).to.equal(15)
      })
      it('has a total link to the proposed moves tab', function() {
        expect(
          locals.dashboardMoveSummary.find(type => {
            return type.filter === 'total'
          }).href
        ).to.equal('/proposed')
      })
      it('drops the proposed moves', function() {
        expect(
          locals.dashboardMoveSummary.find(type => {
            return type.filter === 'proposed'
          })
        ).not.to.exist
      })
      it('calls next', function() {
        expect(next).to.have.been.calledOnce
      })
    })
  })
  describe('#setMovesByDateAndLocation()', function() {
    let res, nextSpy
    const mockCurrentLocation = '5555'

    beforeEach(async function() {
      sinon.stub(moveService, 'getActive')
      sinon.stub(moveService, 'getCancelled')
      nextSpy = sinon.spy()
      res = { locals: {} }
    })

    context('when no move date exists', function() {
      beforeEach(async function() {
        await middleware.setMovesByDateAndLocation({}, res, nextSpy)
      })

      it('should call next with no argument', function() {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })

      it('should not call API with move date', function() {
        expect(moveService.getActive).not.to.be.called
        expect(moveService.getCancelled).not.to.be.called
      })

      it('should not set response data to locals object', function() {
        expect(res.locals).not.to.have.property('movesByDate')
      })
    })

    context('when move date exists', function() {
      beforeEach(function() {
        res = {
          locals: {
            dateRange: ['2010-10-10', '2010-10-11'],
          },
        }
      })

      context('when API call returns successfully', function() {
        beforeEach(function() {
          moveService.getActive.resolves(mockActiveMoves)
          moveService.getCancelled.resolves(mockCancelledMoves)
        })

        context('with location ID', function() {
          beforeEach(async function() {
            res.locals.fromLocationId = mockCurrentLocation
            await middleware.setMovesByDateAndLocation({}, res, nextSpy)
          })

          it('should call API with move date and location ID', function() {
            expect(moveService.getActive).to.be.calledOnceWithExactly({
              dateRange: res.locals.dateRange,
              fromLocationId: res.locals.fromLocationId,
            })
            expect(moveService.getCancelled).to.be.calledOnceWithExactly({
              dateRange: res.locals.dateRange,
              fromLocationId: res.locals.fromLocationId,
            })
          })

          it('should set requested moves on locals', function() {
            expect(res.locals).to.have.property('activeMovesByDate')
            expect(res.locals.activeMovesByDate).to.deep.equal(mockActiveMoves)
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
          moveService.getActive.throws(errorStub)
          await middleware.setMovesByDateAndLocation({}, res, nextSpy)
        })

        it('should not set locals properties', function() {
          expect(res.locals).not.to.have.property('activeMovesByDate')
          expect(res.locals).not.to.have.property('cancelledMovesByDate')
        })

        it('should send error to next function', function() {
          expect(nextSpy).to.be.calledOnceWithExactly(errorStub)
        })
      })
    })
  })

  describe('#setMovesByDateAllLocations()', function() {
    let res, nextSpy

    beforeEach(async function() {
      sinon.stub(moveService, 'getActive')
      sinon.stub(moveService, 'getCancelled')
      nextSpy = sinon.spy()
      res = { locals: {} }
    })

    context('when no move date exists', function() {
      beforeEach(async function() {
        await middleware.setMovesByDateAllLocations({}, res, nextSpy)
      })

      it('should call next with no argument', function() {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })

      it('should not call API with move date', function() {
        expect(moveService.getActive).not.to.be.called
      })

      it('should not set response data to locals object', function() {
        expect(res.locals).not.to.have.property('movesByDate')
      })
    })

    context('when move date exists', function() {
      beforeEach(function() {
        res = {
          locals: {
            dateRange: ['2010-10-10', '2010-10-11'],
          },
        }
      })

      context('when API call returns successfully', function() {
        beforeEach(function() {
          moveService.getActive.resolves(mockActiveMoves)
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

          context('with user locations', function() {
            beforeEach(async function() {
              req.session.user.locations = Array(75)
                .fill()
                .map((v, i) => {
                  return { id: i, title: `Mock location ${i}` }
                })

              await middleware.setMovesByDateAllLocations(req, res, nextSpy)
            })
            it('should call the API with batches of 40 locations by default', function() {
              expect(req.session.user.locations).to.have.length(75)
              expect(moveService.getActive).to.have.callCount(2)
              expect(moveService.getActive).to.be.calledWithExactly({
                dateRange: res.locals.dateRange,
                fromLocationId: req.session.user.locations
                  .map(location => location.id)
                  .slice(0, 40)
                  .join(','),
              })
              expect(moveService.getActive).to.be.calledWithExactly({
                dateRange: res.locals.dateRange,
                fromLocationId: req.session.user.locations
                  .map(location => location.id)
                  .slice(40)
                  .join(','),
              })

              expect(moveService.getCancelled).to.have.callCount(2)
              expect(moveService.getCancelled).to.be.calledWithExactly({
                dateRange: res.locals.dateRange,
                fromLocationId: req.session.user.locations
                  .map(location => location.id)
                  .slice(0, 40)
                  .join(','),
              })
              expect(moveService.getCancelled).to.be.calledWithExactly({
                dateRange: res.locals.dateRange,
                fromLocationId: req.session.user.locations
                  .map(location => location.id)
                  .slice(40)
                  .join(','),
              })
            })

            it('should set active moves on locals', function() {
              expect(res.locals).to.have.property('activeMovesByDate')
              expect(res.locals.activeMovesByDate).to.deep.equal([
                ...mockActiveMoves,
                ...mockActiveMoves,
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
      })

      context('when API call returns an error', function() {
        beforeEach(async function() {
          const req = {
            session: {
              user: {
                locations: [{ id: 1, title: 'Test location' }],
              },
            },
          }
          moveService.getActive.throws(errorStub)
          await middleware.setMovesByDateAllLocations(req, res, nextSpy)
        })

        it('should not set locals properties', function() {
          expect(res.locals).not.to.have.property('activeMovesByDate')
          expect(res.locals).not.to.have.property('cancelledMovesByDate')
        })

        it('should send error to next function', function() {
          expect(nextSpy).to.be.calledOnceWithExactly(errorStub)
        })
      })
    })
  })
})
