const presenters = require('../../../../../common/presenters')
const CreateBaseController = require('../../new/controllers/base')

const BaseProto = CreateBaseController.prototype

const UpdateBaseController = require('./base')

const controller = new UpdateBaseController({ route: '/' })

describe('Assign controllers', function () {
  describe('Assign base controller', function () {
    describe('#middlewareChecks()', function () {
      it('should not inherit middlewareChecks from CreateBaseController', function () {
        expect(controller.middlewareChecks).to.exist.and.not.equal(
          BaseProto.middlewareChecks
        )
      })
    })

    describe('#middlewareLocals()', function () {
      it('should not inherit middlewareLocals from CreateBaseController', function () {
        expect(controller.middlewareLocals).to.exist.and.not.equal(
          BaseProto.middlewareLocals
        )
      })
    })

    describe('#setButtonText()', function () {
      it('should inherit setButtonText from CreateBaseController', function () {
        expect(controller.setButtonText).to.exist.and.equal(
          BaseProto.setButtonText
        )
      })
    })

    describe('#setMoveSummary()', function () {
      let req, res, next

      beforeEach(function () {
        next = sinon.stub()
        sinon.stub(presenters, 'moveToMetaListComponent').returnsArg(0)
        req = {
          move: {
            to_location: 'b',
            other_prop: 'c',
            profile: null,
          },
          sessionModel: {
            toJSON: sinon.stub().returns({
              profile: {
                id: '12345',
              },
            }),
          },
        }
        res = {
          locals: {},
        }
        controller.setMoveSummary(req, res, next)
      })

      it('creates moveSummary on the locals', function () {
        expect(res.locals.moveSummary).to.exist
        expect(res.locals.moveSummary).to.deep.equal({
          to_location: 'b',
          other_prop: 'c',
          profile: {
            id: '12345',
          },
        })
      })

      it('invokes moveToMetaListComponent with move', function () {
        expect(
          presenters.moveToMetaListComponent
        ).to.have.been.calledWithExactly({
          ...req.move,
          profile: {
            id: '12345',
          },
        })
      })
    })

    describe('#setJourneyTimer()', function () {
      it('should inherit setJourneyTimer from CreateBaseController', function () {
        expect(controller.setJourneyTimer).to.exist.and.equal(
          BaseProto.setJourneyTimer
        )
      })
    })

    describe('#checkCurrentLocation()', function () {
      it('should not inherit checkCurrentLocation from CreateBaseController', function () {
        expect(controller.checkCurrentLocation).to.exist.and.not.equal(
          BaseProto.checkCurrentLocation
        )
      })

      it('should call next', function () {
        const nextSpy = sinon.spy()

        controller.checkCurrentLocation({}, {}, nextSpy)

        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })
  })

  describe('#middlewareChecks()', function () {
    beforeEach(function () {
      sinon.stub(BaseProto, 'middlewareChecks')
      sinon.stub(controller, 'use')

      controller.middlewareChecks()
    })

    it('should call parent method', function () {
      expect(BaseProto.middlewareChecks).to.have.been.calledOnce
    })

    it('should call set move method', function () {
      expect(controller.use.getCall(0)).to.have.been.calledWithExactly(
        controller.checkNoProfileExists
      )
    })

    it('should call correct number of additional middleware', function () {
      expect(controller.use).to.have.been.calledOnce
    })
  })

  describe('#middlewareLocals()', function () {
    beforeEach(function () {
      sinon.stub(BaseProto, 'middlewareLocals')
      sinon.stub(controller, 'use')

      controller.middlewareLocals()
    })

    it('should call parent method', function () {
      expect(BaseProto.middlewareLocals).to.have.been.calledOnce
    })

    it('should call set move method', function () {
      expect(controller.use.getCall(0)).to.have.been.calledWithExactly(
        controller.setMove
      )
    })

    it('should call set cancel url method', function () {
      expect(controller.use.getCall(1)).to.have.been.calledWithExactly(
        controller.setCancelUrl
      )
    })

    it('should call correct number of additional middleware', function () {
      expect(controller.use).to.have.been.calledTwice
    })
  })

  describe('#checkNoProfileExists()', function () {
    let req = {}
    let res, nextSpy

    beforeEach(function () {
      nextSpy = sinon.spy()
      req = {
        move: {
          allocation: {
            id: '__allocationId__',
          },
        },
      }
      res = {
        redirect: sinon.stub(),
      }
    })

    context('when profile already exists', function () {
      beforeEach(function () {
        req.move.profile = {
          id: '__profile_id__',
        }
        controller.checkNoProfileExists(req, res, nextSpy)
      })

      it('should redirect back to allocation assign route', function () {
        expect(res.redirect).to.have.been.calledOnceWithExactly(
          '/allocation/__allocationId__/assign'
        )
      })

      it('should not call next', function () {
        expect(nextSpy).not.to.have.been.called
      })
    })

    context('when profile does not exist', function () {
      beforeEach(function () {
        controller.checkNoProfileExists(req, res, nextSpy)
      })

      it('should not redirect', function () {
        expect(res.redirect).not.to.have.been.called
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })
  })

  describe('#setCancelUrl()', function () {
    let req = {}
    let res, nextSpy

    beforeEach(function () {
      nextSpy = sinon.spy()
      req = {
        move: {
          allocation: {
            id: '__allocationId__',
          },
        },
      }
      res = {
        locals: {},
      }
      controller.setCancelUrl(req, res, nextSpy)
    })

    it('should set cancel url correctly', function () {
      expect(res.locals.cancelUrl).to.equal('/allocation/__allocationId__')
    })

    it('should call next', function () {
      expect(nextSpy).to.be.calledOnceWithExactly()
    })
  })

  describe('#setMove()', function () {
    let req
    let nextSpy
    let res = {}

    const moveFilled = {
      id: '__filled__',
      person: { id: '__assigned__ ' },
    }

    beforeEach(function () {
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
        move: moveFilled,
      }
      res = {
        locals: {},
      }
      req.sessionModel.get.withArgs('person').returnsArg(0)
    })

    context('without session', function () {
      beforeEach(function () {
        controller.setMove(req, res, nextSpy)
      })

      it('should set person object on locals', function () {
        expect(req.sessionModel.get).to.be.calledWithExactly('person')
        expect(res.locals.person).to.equal('person')
      })

      it('should set move on session model with res.locals.move', function () {
        expect(req.sessionModel.set).to.be.calledWithExactly('move', moveFilled)
      })

      it('should set move object on locals', function () {
        expect(res.locals.move).to.deep.equal(moveFilled)
      })

      it('should set models on req', function () {
        expect(req.models.move).to.deep.equal(moveFilled)
        expect(req.models.person).to.equal('person')
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('when session already has the move', function () {
      beforeEach(function () {
        req.sessionModel.get.withArgs('move').returnsArg(0)
        controller.setMove(req, res, nextSpy)
      })

      it('should reset move object with the value in the session', function () {
        expect(req.sessionModel.set).to.be.calledWithExactly('move', 'move')
      })
    })
  })
})
