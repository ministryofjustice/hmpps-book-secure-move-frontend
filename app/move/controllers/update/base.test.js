const proxyquire = require('proxyquire')
const personService = require('../../../../common/services/person')

const CreateBaseController = require('../create/base')
const BaseProto = CreateBaseController.prototype

const UpdateBaseController = proxyquire('./base', {
  '../../../../common/services/person': personService,
})

const controller = new UpdateBaseController({ route: '/' })

describe('Move controllers', function() {
  describe('Update base controller', function() {
    describe('#middlewareChecks()', function() {
      it('should inherit middlewareChecks from CreateBaseController', function() {
        expect(controller.middlewareChecks).to.exist.and.equal(
          BaseProto.middlewareChecks
        )
      })
    })

    describe('#middlewareLocals()', function() {
      it('should inherit middlewareLocals from CreateBaseController', function() {
        expect(controller.middlewareLocals).to.exist.and.equal(
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

    describe('#setCancelUrl()', function() {
      const req = {}
      let res, nextSpy

      beforeEach(function() {
        nextSpy = sinon.spy()
        res = {
          locals: {
            moveId: '#moveId',
          },
        }
        sinon.stub(controller, 'getUpdateBackStepUrl').returns('/cancelUrl')
        controller.setCancelUrl(req, res, nextSpy)
      })

      it('should call getUpdateBackStepUrl with correct args', function() {
        expect(controller.getUpdateBackStepUrl).to.be.calledOnceWithExactly(
          req,
          res
        )
      })

      it('should set cancel url correctly', function() {
        expect(res.locals.cancelUrl).to.equal('/cancelUrl')
      })

      it('should call next', function() {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    describe('#getUpdateValues()', function() {
      const req = {
        form: {
          options: {
            fields: {
              field1: {},
              field2: {},
            },
          },
        },
      }
      const res = {}
      const person = { id: '#personId' }
      const values = { foo: 'bar' }

      beforeEach(function() {
        sinon.stub(controller, 'getPerson').returns(person)
        sinon.stub(personService, 'unformat').returns(values)
      })

      it('should return updated values', function() {
        expect(controller.getUpdateValues(req, res)).to.equal(values)
      })

      context('When a valid ', function() {
        this.beforeEach(function() {
          controller.getUpdateValues(req, res)
        })
        it('should get person data', function() {
          expect(controller.getPerson).to.be.calledOnceWithExactly(req, res)
        })
        it('should get person data', function() {
          expect(personService.unformat).to.be.calledOnceWithExactly(person, [
            'field1',
            'field2',
          ])
        })
      })
    })

    describe('#getMove()', function() {
      const req = {}
      const res = {
        locals: {},
      }
      const mockMove = {
        foo: 'bar',
      }

      context('When move exists', function() {
        beforeEach(function() {
          res.locals.move = mockMove
        })
        it('should return move', function() {
          expect(controller.getMove(req, res)).to.equal(mockMove)
        })
      })

      context('When no move exists', function() {
        beforeEach(function() {
          delete res.locals.move
        })
        it('should return an empty object', function() {
          expect(controller.getMove(req, res)).to.deep.equal({})
        })
      })
    })

    describe('#getPerson()', function() {
      const req = {}
      const res = {}
      const mockPerson = {
        foo: 'bar',
      }

      beforeEach(function() {
        sinon.stub(controller, 'getMove').returns()
      })

      it('should get move correctly', function() {
        controller.getPerson(req, res)
        expect(controller.getMove).to.be.calledOnceWithExactly(req, res)
      })

      context('When move has a person', function() {
        beforeEach(function() {
          controller.getMove.returns({
            person: mockPerson,
          })
        })
        it('should return the person', function() {
          expect(controller.getPerson(req, res)).to.equal(mockPerson)
        })
      })

      context('When move has no person', function() {
        it('should return an empty object', function() {
          expect(controller.getPerson(req, res)).to.deep.equal({})
        })
      })
    })

    describe('#mixin', function() {
      class BaseSource {
        baseMethod() {
          return 'BaseSource'
        }
      }
      class BaseTarget extends BaseSource {
        baseMethod() {
          return 'BaseTarget'
        }
      }
      class ControllerSource extends BaseSource {
        superMethod() {
          return 'ControllerSource - superMethod'
        }

        thisMethod() {
          return 'ControllerSource - thisMethod'
        }

        superMethodSource() {
          return super.baseMethod()
        }

        thisMethodSource() {
          return this.baseMethod()
        }
      }
      class ControllerTarget extends BaseTarget {
        superMethod() {
          return super.baseMethod()
        }

        thisMethod() {
          return this.baseMethod()
        }

        superMethodTarget() {
          return super.baseMethod()
        }

        thisMethodTarget() {
          return this.baseMethod()
        }
      }
      UpdateBaseController.mixin(ControllerTarget, ControllerSource)

      const SourceProto = ControllerSource.prototype
      const TargetProto = ControllerTarget.prototype
      const controller = new ControllerTarget()

      context('When method exists only in target controller', function() {
        it('should leave it untouched', function() {
          expect(TargetProto.superMethodTarget).to.exist
          expect(TargetProto.thisMethodTarget).to.exist
          expect(SourceProto.superMethodTarget).to.not.exist
          expect(SourceProto.thisMethodTarget).to.not.exist
        })

        it('should resolve `this` to extended class', function() {
          expect(controller.thisMethodTarget()).to.equal('BaseTarget')
        })

        it('should resolve `super` to extended class', function() {
          expect(controller.superMethodTarget()).to.equal('BaseTarget')
        })
      })

      context('When method exists in both controllers', function() {
        it('should leave it untouched', function() {
          expect(TargetProto.superMethod).to.exist
          expect(SourceProto.superMethod).to.exist
          expect(TargetProto.superMethod).to.not.equal(SourceProto.superMethod)
          expect(TargetProto.thisMethod).to.exist
          expect(SourceProto.thisMethod).to.exist
          expect(TargetProto.thisMethod).to.not.equal(SourceProto.thisMethod)
        })

        it('should resolve `this` to extended class', function() {
          expect(controller.thisMethod()).to.equal('BaseTarget')
        })

        it('should resolve `super` to extended class', function() {
          expect(controller.superMethod()).to.equal('BaseTarget')
        })
      })

      context('When method exists only in source controller', function() {
        it('should append it to target', function() {
          expect(TargetProto.superMethodSource).to.exist
          expect(TargetProto.superMethodSource).to.equal(
            SourceProto.superMethodSource
          )
          expect(TargetProto.thisMethodSource).to.exist
          expect(TargetProto.thisMethodSource).to.equal(
            SourceProto.thisMethodSource
          )
        })

        it('should resolve `this` to extended class', function() {
          expect(controller.thisMethodSource()).to.equal('BaseTarget')
        })

        it('should resolve `super` to mixed-in class', function() {
          expect(controller.superMethodSource()).to.equal('BaseSource')
        })
      })
    })
  })
})
