const proxyquire = require('proxyquire').noCallThru()

const populateResources = sinon.stub()

const middleware = proxyquire('./middleware', {
  '../../common/lib/populate-resources': populateResources,
  '../../app/tools': {
    mountpath: '/tools-path',
    routes: {
      moveChangeStatus: '/move-path',
      completeAssessment: '/assessment-path',
    },
  },
})

const moveStub = { foo: 'bar' }
const moveEvents = ['a', 'b', 'c']
const moveWithEventsStub = { foo: 'bar', timeline_events: moveEvents }
const moveWithAllocationStub = {
  foo: 'bar',
  allocation: { id: '#allocationId', fizz: 'buzz' },
}
const allocationStub = { fizz: 'buzz' }
const journeysStub = { id: 'FACEFEED' }
const mockMoveId = '6904dea1-017f-48d8-a5ad-2723dee9d146'
const errorStub = new Error('Problem')

describe('Move middleware', function () {
  describe('#setMove()', function () {
    let req, res, nextSpy, moveService

    beforeEach(function () {
      req = {
        params: {},
      }
      res = {}
      nextSpy = sinon.spy()
      moveService = {
        getById: sinon.stub().resolves(moveStub),
      }
      req.services = {
        move: moveService,
      }
    })

    context('when no move ID exists', function () {
      beforeEach(async function () {
        await middleware.setMove(req, res, nextSpy)
      })

      it('should call next with no argument', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })

      it('should not call API with move ID', function () {
        expect(moveService.getById).not.to.be.called
      })

      it('should not set response data to request object', function () {
        expect(req).not.to.have.property('move')
      })
    })

    context('when move ID exists', function () {
      context('when API call returns succesfully', function () {
        beforeEach(async function () {
          req.params.moveId = mockMoveId
          await middleware.setMove(req, res, nextSpy)
        })

        it('should call API with move ID', function () {
          expect(moveService.getById).to.be.calledWith(mockMoveId)
        })

        it('should set response data to request object', function () {
          expect(req).to.have.property('move')
          expect(req.move).to.equal(moveStub)
        })

        it('should call next with no argument', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('when API call returns an error', function () {
        beforeEach(async function () {
          await middleware.setMove(
            {
              params: {
                moveId: mockMoveId,
              },
              services: { move: { getById: sinon.stub().throws(errorStub) } },
            },
            res,
            nextSpy
          )
        })

        it('should not set response data to request object', function () {
          expect(req).not.to.have.property('move')
        })

        it('should send error to next function', function () {
          expect(nextSpy).to.be.calledOnceWithExactly(errorStub)
        })
      })
    })
  })

  describe('#setMoveWithEvents()', function () {
    let req, res, nextSpy, moveService

    beforeEach(function () {
      req = {
        params: {},
      }
      res = {}
      nextSpy = sinon.spy()

      moveService = {
        getByIdWithEvents: sinon.stub().resolves(moveWithEventsStub),
      }
      req.services = {
        move: moveService,
      }
    })

    context('when no move ID exists', function () {
      beforeEach(async function () {
        await middleware.setMoveWithEvents(req, res, nextSpy)
      })

      it('should call next with no argument', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })

      it('should not call API with move ID', function () {
        expect(moveService.getByIdWithEvents).not.to.be.called
      })

      it('should not set response data to request object', function () {
        expect(req).not.to.have.property('move')
      })
    })

    context('when moveId exists', function () {
      context('when API call returns succesfully', function () {
        beforeEach(async function () {
          req.params.moveId = mockMoveId
          await middleware.setMoveWithEvents(req, res, nextSpy)
        })

        it('should call API with move ID', function () {
          expect(moveService.getByIdWithEvents).to.be.calledWith(mockMoveId)
        })

        it('should populate timeline events', function () {
          expect(populateResources).to.be.calledWith(moveEvents, req)
        })

        it('should set response data to request object', function () {
          expect(req).to.have.property('move')
          expect(req.move).to.equal(moveWithEventsStub)
        })

        it('should call next with no argument', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('when API call returns an error', function () {
        beforeEach(async function () {
          await middleware.setMoveWithEvents(
            {
              params: { moveId: mockMoveId },
              services: {
                move: { getByIdWithEvents: sinon.stub().throws(errorStub) },
              },
            },
            res,
            nextSpy
          )
        })

        it('should not set response data to request object', function () {
          expect(req).not.to.have.property('move')
        })

        it('should send error to next function', function () {
          expect(nextSpy).to.be.calledOnceWithExactly(errorStub)
        })
      })
    })
  })

  describe('#setPersonEscortRecord()', function () {
    let mockReq, nextSpy

    beforeEach(function () {
      nextSpy = sinon.spy()
      mockReq = {}
    })

    context('without Person Escort Record', function () {
      beforeEach(function () {
        middleware.setPersonEscortRecord(mockReq, {}, nextSpy)
      })

      it('should not set request property', function () {
        expect(mockReq).not.to.contain.property('personEscortRecord')
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('with Person Escort Record', function () {
      beforeEach(function () {
        mockReq = {
          move: {
            profile: {
              person_escort_record: {
                id: '12345',
                status: 'not_started',
              },
            },
          },
        }
        middleware.setPersonEscortRecord(mockReq, {}, nextSpy)
      })

      it('should set request property', function () {
        expect(mockReq).to.contain.property('personEscortRecord')
        expect(mockReq.personEscortRecord).to.deep.equal({
          id: '12345',
          status: 'not_started',
        })
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })
  })

  describe('#setYouthRiskAssessment()', function () {
    let mockReq, nextSpy

    beforeEach(function () {
      nextSpy = sinon.spy()
      mockReq = {}
    })

    context('without record', function () {
      beforeEach(function () {
        middleware.setYouthRiskAssessment(mockReq, {}, nextSpy)
      })

      it('should not set request property', function () {
        expect(mockReq).not.to.contain.property('youthRiskAssessment')
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('with record', function () {
      beforeEach(function () {
        mockReq = {
          move: {
            profile: {
              youth_risk_assessment: {
                id: '12345',
                status: 'not_started',
              },
            },
          },
        }
        middleware.setYouthRiskAssessment(mockReq, {}, nextSpy)
      })

      it('should set request property', function () {
        expect(mockReq).to.contain.property('youthRiskAssessment')
        expect(mockReq.youthRiskAssessment).to.deep.equal({
          id: '12345',
          status: 'not_started',
        })
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })
  })

  describe('#setAllocation()', function () {
    let req, res, nextSpy, allocationService

    beforeEach(function () {
      allocationService = {
        getById: sinon.stub(),
      }

      req = {
        services: {
          allocation: allocationService,
        },
      }
      res = {}
      nextSpy = sinon.spy()
    })

    context('when no move exists', function () {
      beforeEach(async function () {
        await middleware.setAllocation(req, res, nextSpy)
      })

      it('should call next with no argument', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })

      it('should not call service', function () {
        expect(allocationService.getById).not.to.be.called
      })

      it('should not set response data on request object', function () {
        expect(req).not.to.have.property('allocation')
      })
    })

    context('when move exists', function () {
      beforeEach(function () {
        req.move = moveStub
      })

      context('when move does not contain allocation', function () {
        beforeEach(async function () {
          await middleware.setAllocation({}, res, nextSpy)
        })

        it('should call next with no argument', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })

        it('should not call service', function () {
          expect(allocationService.getById).not.to.be.called
        })

        it('should not set response data on request object', function () {
          expect(req).not.to.have.property('allocation')
        })
      })

      context('when move contains allocation', function () {
        beforeEach(function () {
          req.move = moveWithAllocationStub
        })

        context('when API call returns succesfully', function () {
          beforeEach(async function () {
            allocationService.getById = sinon.stub().resolves(allocationStub)
            await middleware.setAllocation(req, res, nextSpy)
          })

          it('should call API with allocation ID', function () {
            expect(allocationService.getById).to.be.calledOnceWithExactly(
              '#allocationId'
            )
          })

          it('should set response data to locals object', function () {
            expect(req).to.have.property('allocation')
            expect(req.allocation).to.equal(allocationStub)
          })

          it('should call next with no argument', function () {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })
        })

        context('when API call returns an error', function () {
          beforeEach(async function () {
            allocationService.getById = sinon.stub().throws(errorStub)
            await middleware.setAllocation(req, res, nextSpy)
          })

          it('should not set response data on request object', function () {
            expect(req).not.to.have.property('allocation')
          })

          it('should send error to next function', function () {
            expect(nextSpy).to.be.calledOnceWithExactly(errorStub)
          })
        })
      })
    })
  })

  describe('#setJourneys()', function () {
    let req, res, nextSpy, journeyService

    beforeEach(function () {
      journeyService = {
        getByMoveId: sinon.stub(),
      }

      req = {
        services: {
          journey: journeyService,
        },
      }
      res = {}
      nextSpy = sinon.spy()
    })

    context('when no move exists', function () {
      beforeEach(async function () {
        await middleware.setJourneys(req, res, nextSpy)
      })

      it('should call next with no argument', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })

      it('should not call service', function () {
        expect(journeyService.getByMoveId).not.to.be.called
      })

      it('should not set response data on request object', function () {
        expect(req).not.to.have.property('allocation')
      })
    })

    context('when move exists', function () {
      beforeEach(function () {
        req.move = { ...moveStub, id: 'ABADCAFE' }
      })

      context('when API call returns succesfully', function () {
        beforeEach(async function () {
          journeyService.getByMoveId = sinon.stub().resolves(journeysStub)
          await middleware.setJourneys(req, res, nextSpy)
        })

        it('should call API with allocation ID', function () {
          expect(journeyService.getByMoveId).to.be.calledOnceWithExactly(
            'ABADCAFE'
          )
        })

        it('should set response data to req.journeys', function () {
          expect(req).to.have.property('journeys')
          expect(req.journeys).to.equal(journeysStub)
        })

        it('should call next with no argument', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('when API call returns an error', function () {
        beforeEach(async function () {
          journeyService.getByMoveId = sinon.stub().throws(errorStub)
          await middleware.setJourneys(req, res, nextSpy)
        })

        it('should not set response data on request object', function () {
          expect(req).not.to.have.property('journeys')
        })

        it('should send error to next function', function () {
          expect(nextSpy).to.be.calledOnceWithExactly(errorStub)
        })
      })
    })
  })

  context('#setDevelopmentTools', function () {
    let req, res, nextSpy

    beforeEach(function () {
      req = {}
      res = {
        locals: {},
      }
      nextSpy = sinon.spy()
    })

    context('without existing development tools', function () {
      beforeEach(function () {
        middleware.setDevelopmentTools(req, res, nextSpy)
      })

      it('should not append to locals', function () {
        expect(res.locals).to.deep.equal({})
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('with existing development tools', function () {
      beforeEach(function () {
        res.locals.DEVELOPMENT_TOOLS = {}
      })

      context('without move', function () {
        beforeEach(function () {
          middleware.setDevelopmentTools(req, res, nextSpy)
        })

        it('should not append to locals', function () {
          expect(res.locals).to.deep.equal({
            DEVELOPMENT_TOOLS: {},
          })
        })

        it('should call next', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('with move', function () {
        beforeEach(function () {
          req.move = {
            id: '12345',
            status: 'booked',
          }
        })

        context('without existing items', function () {
          beforeEach(function () {
            middleware.setDevelopmentTools(req, res, nextSpy)
          })

          it('should add items to locals', function () {
            expect(res.locals.DEVELOPMENT_TOOLS).to.deep.equal({
              items: [
                {
                  text: 'Move:',
                },
                {
                  text: 'Progress status',
                  href: '/tools-path/move-path/12345/booked',
                },
              ],
            })
          })

          it('should call next', function () {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })
        })

        context('with existing items', function () {
          beforeEach(function () {
            res.locals.DEVELOPMENT_TOOLS.items = [
              {
                name: 'foo',
                href: '#bar',
              },
            ]

            middleware.setDevelopmentTools(req, res, nextSpy)
          })

          it('should append to locals', function () {
            expect(res.locals.DEVELOPMENT_TOOLS).to.deep.equal({
              items: [
                {
                  name: 'foo',
                  href: '#bar',
                },
                {
                  text: 'Move:',
                },
                {
                  text: 'Progress status',
                  href: '/tools-path/move-path/12345/booked',
                },
              ],
            })
          })

          it('should call next', function () {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })
        })

        context('with unconfirmed assessments', function () {
          beforeEach(function () {
            req.move.profile = {
              person_escort_record: {
                id: 'per12345',
              },
              youth_risk_assessment: {
                id: 'youth12345',
              },
            }
            middleware.setDevelopmentTools(req, res, nextSpy)
          })

          it('should append assessment links', function () {
            expect(res.locals.DEVELOPMENT_TOOLS).to.deep.equal({
              items: [
                {
                  text: 'Move:',
                },
                {
                  text: 'Progress status',
                  href: '/tools-path/move-path/12345/booked',
                },
                {
                  text: 'Complete Person Escort Record',
                  href: '/tools-path/assessment-path/person-escort-record/per12345',
                },
                {
                  text: 'Complete Youth Risk Assessment',
                  href: '/tools-path/assessment-path/youth-risk-assessment/youth12345',
                },
              ],
            })
          })

          it('should call next', function () {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })
        })

        context('with confirmed assessments', function () {
          beforeEach(function () {
            req.move.profile = {
              person_escort_record: {
                id: 'per12345',
                status: 'confirmed',
              },
              youth_risk_assessment: {
                id: 'youth12345',
                status: 'confirmed',
              },
            }
            middleware.setDevelopmentTools(req, res, nextSpy)
          })

          it('should not append assessment links', function () {
            expect(res.locals.DEVELOPMENT_TOOLS).to.deep.equal({
              items: [
                {
                  text: 'Move:',
                },
                {
                  text: 'Progress status',
                  href: '/tools-path/move-path/12345/booked',
                },
              ],
            })
          })

          it('should call next', function () {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })
        })
      })
    })
  })
})
