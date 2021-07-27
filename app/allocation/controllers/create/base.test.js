const ParentController = require('../../../../common/controllers/form-wizard')

const Controller = require('./base')
const controller = new Controller({
  route: '/',
})

describe('Base controller for create allocation', function () {
  let nextSpy

  beforeEach(function () {
    nextSpy = sinon.spy()
  })

  describe('#middlewareLocals', function () {
    beforeEach(function () {
      sinon.stub(ParentController.prototype, 'middlewareLocals')
      sinon.stub(controller, 'use')

      controller.middlewareLocals()
    })

    it('should call parent method', function () {
      expect(ParentController.prototype.middlewareLocals).to.have.been
        .calledOnce
    })

    it('should call set button text method', function () {
      expect(controller.use).to.have.been.calledWith(controller.setButtonText)
    })

    it('should call set cancel URL method', function () {
      expect(controller.use).to.have.been.calledWith(controller.setCancelUrl)
    })
  })

  describe('#setButtonText', function () {
    let req

    beforeEach(function () {
      req = {
        form: {
          options: {
            steps: {
              '/': {},
              '/step-one': {},
              '/last-step': {},
            },
          },
        },
      }
      sinon.stub(ParentController.prototype, 'getNextStep')
    })

    context('with buttonText option', function () {
      beforeEach(function () {
        req.form.options.buttonText = 'Override button text'
        ParentController.prototype.getNextStep.returns('/')

        controller.setButtonText(req, {}, nextSpy)
      })

      it('should set button text correctly', function () {
        expect(req.form.options.buttonText).to.equal('Override button text')
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('with no buttonText option', function () {
      context('when step is not penultimate step', function () {
        beforeEach(function () {
          ParentController.prototype.getNextStep.returns('/step-one')

          controller.setButtonText(req, {}, nextSpy)
        })

        it('should set button text correctly', function () {
          expect(req.form.options.buttonText).to.equal('actions::continue')
        })

        it('should call next', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('when step is penultimate step', function () {
        beforeEach(function () {
          ParentController.prototype.getNextStep.returns('/last-step')
          controller.setButtonText(req, {}, nextSpy)
        })

        it('should set button text correctly', function () {
          expect(req.form.options.buttonText).to.equal(
            'actions::create_allocation'
          )
        })

        it('should call next', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })
    })
  })

  describe('#setCancelUrl', function () {
    let locals

    beforeEach(function () {
      locals = {}
      controller.setCancelUrl({}, { locals }, nextSpy)
    })

    it('sets the cancelUrl on locals', function () {
      expect(locals).to.deep.equal({
        cancelUrl: '/allocations',
      })
    })

    it('calls next', function () {
      expect(nextSpy).to.have.been.calledOnce
    })
  })
})
