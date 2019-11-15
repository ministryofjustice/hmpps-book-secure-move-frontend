const FormController = require('hmpo-form-wizard').Controller

const CreateBaseController = require('./base')

const controller = new CreateBaseController({ route: '/' })

const mockHrTime = [11111, 22222]

describe('Move controllers', function() {
  describe('Create base controller', function() {
    describe('#middlewareChecks()', function() {
      beforeEach(function() {
        sinon.stub(FormController.prototype, 'middlewareChecks')
        sinon.stub(controller, 'use')

        controller.middlewareChecks()
      })

      it('should call parent method', function() {
        expect(FormController.prototype.middlewareChecks).to.have.been
          .calledOnce
      })

      it('should call check current location method', function() {
        expect(controller.use).to.have.been.calledWith(
          controller.checkCurrentLocation
        )
      })
    })

    describe('#middlewareLocals()', function() {
      beforeEach(function() {
        sinon.stub(FormController.prototype, 'middlewareLocals')
        sinon.stub(controller, 'use')

        controller.middlewareLocals()
      })

      it('should call parent method', function() {
        expect(FormController.prototype.middlewareLocals).to.have.been
          .calledOnce
      })

      it('should call set cancel url method', function() {
        expect(controller.use).to.have.been.calledWith(controller.setCancelUrl)
      })
    })

    describe('#setCancelUrl()', function() {
      let res, nextSpy

      beforeEach(function() {
        nextSpy = sinon.spy()
        res = {
          locals: {},
        }
      })

      context('with no moves url local', function() {
        beforeEach(function() {
          controller.setCancelUrl({}, res, nextSpy)
        })

        it('should set cancel url correctly', function() {
          expect(res.locals).to.have.property('cancelUrl')
          expect(res.locals.cancelUrl).to.be.undefined
        })

        it('should call next', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('with moves url local', function() {
        beforeEach(function() {
          res.locals.MOVES_URL = '/moves?move-date=2019-10-10'
          controller.setCancelUrl({}, res, nextSpy)
        })

        it('should set cancel url moves url', function() {
          expect(res.locals).to.have.property('cancelUrl')
          expect(res.locals.cancelUrl).to.equal('/moves?move-date=2019-10-10')
        })

        it('should call next', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })
    })

    describe('#checkCurrentLocation()', function() {
      let req, nextSpy

      beforeEach(function() {
        nextSpy = sinon.spy()
        req = {
          session: {},
        }
      })

      context('when current location exists', function() {
        beforeEach(function() {
          req.session = {
            currentLocation: {},
          }
          controller.checkCurrentLocation(req, {}, nextSpy)
        })

        it('should call next without error', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('when no current location exists', function() {
        beforeEach(function() {
          controller.checkCurrentLocation(req, {}, nextSpy)
        })

        it('should call next with error', function() {
          expect(nextSpy).to.be.calledOnce
          expect(nextSpy.args[0][0]).to.be.an('error')
          expect(nextSpy.args[0][0].message).to.equal(
            'Current location is not set in session'
          )
          expect(nextSpy.args[0][0].code).to.equal('MISSING_LOCATION')
        })
      })
    })

    describe('#setMoveSummary()', function() {
      let req, res, nextSpy

      const mockPerson = {
        first_names: 'Mr',
        fullname: 'Benn, Mr',
        last_name: 'Benn',
      }
      const mockSessionModel = overrides => {
        const sessionModel = {
          date: '2019-06-09',
          time_due: '2000-01-01T14:00:00Z',
          move_type: 'court_appearance',
          to_location: {
            title: 'Mock to location',
          },
          additional_information: 'Additional information',
          person: mockPerson,
          ...overrides,
        }

        return {
          ...sessionModel,
          toJSON: () => sessionModel,
          get: () => sessionModel.person,
        }
      }
      const expectedMoveSummary = {
        items: [
          { key: { text: 'From' }, value: { text: 'Mock location' } },
          {
            key: { text: 'To' },
            value: { text: 'Mock to location — Additional information' },
          },
          { key: { text: 'Date' }, value: { text: 'Sunday 9 Jun 2019' } },
          { key: { text: 'Time due' }, value: { text: '2pm' } },
        ],
      }

      beforeEach(function() {
        nextSpy = sinon.spy()
        req = {
          session: {
            currentLocation: {
              title: 'Mock location',
            },
          },
        }
        res = {
          locals: {},
        }
      })

      context('when current location exists', function() {
        beforeEach(async function() {
          req.sessionModel = mockSessionModel()

          await controller.setMoveSummary(req, res, nextSpy)
        })

        it('should set locals as expected', function() {
          expect(res.locals).to.deep.equal({
            person: mockPerson,
            moveSummary: expectedMoveSummary,
          })
        })

        it('should call next without error', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('without move_type', function() {
        beforeEach(async function() {
          req.sessionModel = mockSessionModel({
            move_type: '',
          })

          await controller.setMoveSummary(req, res, nextSpy)
        })

        it('should set locals as expected', function() {
          expect(res.locals).to.deep.equal({
            person: mockPerson,
            moveSummary: {},
          })
        })

        it('should call next without error', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })
    })

    describe('#setJourneyTimer()', function() {
      let req, nextSpy

      beforeEach(function() {
        sinon.stub(process, 'hrtime').returns(mockHrTime)
        nextSpy = sinon.spy()
      })

      context('with no time in the session', function() {
        beforeEach(function() {
          req = {
            session: {
              createMoveJourneyTime: undefined,
            },
          }

          controller.setJourneyTimer(req, {}, nextSpy)
        })

        it('should set time', function() {
          expect(req.session.createMoveJourneyTime).to.equal(mockHrTime)
        })

        it('should call next', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('with time in the session', function() {
        beforeEach(function() {
          req = {
            session: {
              createMoveJourneyTime: mockHrTime,
            },
          }
          controller.setJourneyTimer(req, {}, nextSpy)
        })

        it('should not set time', function() {
          expect(process.hrtime).to.not.be.called
          expect(req.session.createMoveJourneyTime).to.equal(mockHrTime)
        })

        it('should call next', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })
    })
  })
})
