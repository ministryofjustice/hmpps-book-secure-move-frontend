const presenters = require('../../../../common/presenters')
const CreateBaseController = require('../../../move/controllers/create/base')

const BaseProto = CreateBaseController.prototype

const UpdateBaseController = require('./base')

const controller = new UpdateBaseController({ route: '/' })

describe('Assign controllers', function() {
  describe('Assign base controller', function() {
    describe('#middlewareChecks()', function() {
      it('should inherit middlewareChecks from CreateBaseController', function() {
        expect(controller.middlewareChecks).to.exist.and.equal(
          BaseProto.middlewareChecks
        )
      })
    })

    describe('#middlewareLocals()', function() {
      it('should not inherit middlewareLocals from CreateBaseController', function() {
        expect(controller.middlewareLocals).to.exist.and.not.equal(
          BaseProto.middlewareLocals
        )
      })
    })

    describe('#setButtonText()', function() {
      it('should inherit setButtonText from CreateBaseController', function() {
        expect(controller.setButtonText).to.exist.and.equal(
          BaseProto.setButtonText
        )
      })
    })

    describe('#setMoveSummary()', function() {
      let locals
      let next
      beforeEach(function() {
        next = sinon.stub()
        sinon
          .stub(presenters, 'moveToMetaListComponent')
          .returns({ summary: {} })
        locals = {
          move: {
            to_location: 'b',
            other_prop: 'c',
          },
        }
        controller.setMoveSummary(
          {
            session: {
              currentLocation: 'a',
            },
          },
          {
            locals,
          },
          next
        )
      })
      it('creates moveSummary on the locals', function() {
        expect(locals.moveSummary).to.exist
        expect(locals.moveSummary).to.deep.equal({ summary: {} })
      })
      it('invokes moveToMetaListComponent with a subset of properties', function() {
        expect(
          presenters.moveToMetaListComponent
        ).to.have.been.calledWithExactly({
          from_location: 'a',
          to_location: 'b',
        })
      })
    })

    describe('#setJourneyTimer()', function() {
      it('should inherit setJourneyTimer from CreateBaseController', function() {
        expect(controller.setJourneyTimer).to.exist.and.equal(
          BaseProto.setJourneyTimer
        )
      })
    })

    describe('#checkCurrentLocation()', function() {
      it('should inherit checkCurrentLocation from CreateBaseController', function() {
        expect(controller.checkCurrentLocation).to.exist.and.equal(
          BaseProto.checkCurrentLocation
        )
      })
    })
  })

  describe('#middlewareLocals()', function() {
    beforeEach(function() {
      sinon.stub(BaseProto, 'middlewareLocals')
      sinon.stub(controller, 'use')

      controller.middlewareLocals()
    })

    it('should call parent method', function() {
      expect(BaseProto.middlewareLocals).to.have.been.calledOnce
    })

    it('should call set move method', function() {
      expect(controller.use.getCall(0)).to.have.been.calledWithExactly(
        controller.setMove
      )
    })

    it('should call set cancel url method', function() {
      expect(controller.use.getCall(1)).to.have.been.calledWithExactly(
        controller.setCancelUrl
      )
    })

    it('should call correct number of additional middleware', function() {
      expect(controller.use).to.have.been.calledTwice
    })
  })

  describe('#setCancelUrl()', function() {
    let req = {}
    let res, nextSpy

    beforeEach(function() {
      nextSpy = sinon.spy()
      req = {}
      res = {
        locals: {
          move: {
            allocation: {
              id: '__allocationId__',
            },
          },
        },
      }
      controller.setCancelUrl(req, res, nextSpy)
    })

    it('should set cancel url correctly', function() {
      expect(res.locals.cancelUrl).to.equal('/allocation/__allocationId__')
    })

    it('should call next', function() {
      expect(nextSpy).to.be.calledOnceWithExactly()
    })
  })

  describe('#setMove()', function() {
    let req
    let nextSpy
    let res = {}

    const moveFilled = {
      id: '__filled__',
      person: { id: '__assigned__ ' },
    }

    beforeEach(function() {
      nextSpy = sinon.spy()
      req = {
        form: {
          options: {
            route: '/foo',
          },
        },
        sessionModel: {
          get: sinon.stub(),
          set: sinon.stub(),
        },
        models: {},
      }
      res = {
        locals: {
          move: moveFilled,
        },
      }
      req.sessionModel.get.withArgs('person').returnsArg(0)
    })

    context('without session', function() {
      beforeEach(function() {
        controller.setMove(req, res, nextSpy)
      })

      it('should set person object on locals', function() {
        expect(req.sessionModel.get).to.be.calledWithExactly('person')
        expect(res.locals.person).to.equal('person')
      })

      it('should set move on session model with res.locals.move', function() {
        expect(req.sessionModel.set).to.be.calledWithExactly('move', moveFilled)
      })

      it('should set move object on locals', function() {
        expect(res.locals.move).to.deep.equal(moveFilled)
      })

      it('should set models on req', function() {
        expect(req.models.move).to.deep.equal(moveFilled)
        expect(req.models.person).to.equal('person')
      })

      it('should call next', function() {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('when session already has the move', function() {
      beforeEach(function() {
        req.sessionModel.get.withArgs('move').returnsArg(0)
        controller.setMove(req, res, nextSpy)
      })

      it('should reset move object with the value in the session', function() {
        expect(req.sessionModel.set).to.be.calledWithExactly('move', 'move')
      })
    })
  })
})
