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
      it('should inherit setMoveSummary from CreateBaseController', function() {
        expect(controller.setMoveSummary).to.exist.and.equal(
          BaseProto.setMoveSummary
        )
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

    it('should call set cancel url method', function() {
      expect(controller.use.getCall(0)).to.have.been.calledWithExactly(
        controller.setCancelUrl
      )
    })

    it('should call set move method', function() {
      expect(controller.use.getCall(1)).to.have.been.calledWithExactly(
        controller.setMove
      )
    })

    it('should call correct number of additional middleware', function() {
      expect(controller.use).to.be.callCount(2)
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
          allocation: {
            id: '__allocationId__',
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
    const moveUnfilled = {
      id: '__unfilled__',
      person: null,
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
          get: sinon.stub().returnsArg(0),
          set: sinon.stub(),
        },
      }
      res = {
        locals: {
          allocation: {
            moves: [moveFilled, moveUnfilled],
          },
        },
      }
    })

    context('when allocation has unfilled move', function() {
      beforeEach(function() {
        controller.setMove(req, res, nextSpy)
      })
      it('should set move object on session model', function() {
        expect(req.sessionModel.set.getCall(0).args).to.deep.equal([
          'move',
          moveUnfilled,
        ])
      })

      it('should set person object on locals', function() {
        expect(req.sessionModel.get.getCall(0).args).to.deep.equal(['person'])
        expect(res.locals.person).to.equal('person')
      })

      it('should set move object on locals', function() {
        expect(req.sessionModel.get.getCall(1).args).to.deep.equal(['move'])
        expect(res.locals.move).to.equal('move')
      })

      it('should set addAnother on locals', function() {
        expect(res.locals.addAnother).to.equal(true)
      })

      it('should call next', function() {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('when allocation has no unfilled moves', function() {
      beforeEach(function() {
        res = {
          redirect: sinon.stub(),
          locals: {
            cancelUrl: '__allocation_url__',
            allocation: {
              moves: [moveFilled],
            },
          },
        }
      })

      context('and view is not confirmation', function() {
        beforeEach(function() {
          controller.setMove(req, res, nextSpy)
        })

        it('should not set move object on session model', function() {
          expect(req.sessionModel.set).to.not.be.called
        })

        it('should redirect back to allocation view', function() {
          expect(res.redirect).to.be.calledOnceWithExactly('__allocation_url__')
        })

        it('should not call next', function() {
          expect(nextSpy).to.not.be.called
        })
      })

      context('and view is confirmation', function() {
        beforeEach(function() {
          req.form.options.route = '/confirmation'
          controller.setMove(req, res, nextSpy)
        })

        it('should not set move object on session model', function() {
          expect(req.sessionModel.set).to.not.be.called
        })

        it('should not redirect back to allocation view', function() {
          expect(res.redirect).to.not.be.called
        })

        it('should call next', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })
    })
  })
})
