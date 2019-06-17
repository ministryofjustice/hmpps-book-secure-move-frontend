const FormController = require('hmpo-form-wizard').Controller

const Controller = require('./save')
const moveService = require('../../../common/services/move')

const controller = new Controller({ route: '/' })

const moveMock = {
  id: '3333',
}
const valuesMock = {
  'csrf-secret': 'secret',
  errors: null,
  errorValues: {
    reference: '',
    to_location: 'Court',
    from_location: 'Prison',
  },
  reference: '',
  to_location: 'Court',
  from_location: 'Prison',
}

describe('Moves controllers', function () {
  describe('Save', function () {
    describe('#saveValues()', function () {
      let req, nextSpy

      beforeEach(function () {
        nextSpy = sinon.spy()
        req = {
          form: {
            values: {},
          },
          sessionModel: {
            toJSON: () => valuesMock,
          },
        }
      })

      context('when save is successful', function () {
        beforeEach(async function () {
          sinon.spy(FormController.prototype, 'configure')
          sinon.stub(moveService, 'create').resolves(moveMock)
          await controller.saveValues(req, {}, nextSpy)
        })

        it('should filter out correct properties', function () {
          expect(moveService.create).to.be.calledWith({
            reference: '',
            to_location: 'Court',
            from_location: 'Prison',
          })
        })

        it('should not throw an error', function () {
          expect(nextSpy).to.be.calledOnce
          expect(nextSpy).to.be.calledWith()
        })
      })

      context('when save fails', function () {
        const errorMock = new Error('Problem')

        beforeEach(async function () {
          sinon.stub(moveService, 'create').throws(errorMock)
          await controller.saveValues(req, {}, nextSpy)
        })

        it('should call next with the error', function () {
          expect(nextSpy).to.be.calledWith(errorMock)
        })

        it('should call next once', function () {
          expect(nextSpy).to.be.calledOnce
        })

        it('should not set person response on form values', function () {
          expect(req.form.values).not.to.have.property('person')
        })
      })
    })

    describe('#successHandler()', function () {
      let req, res

      beforeEach(function () {
        req = {
          form: {
            values: {},
          },
          sessionModel: {
            reset: sinon.stub(),
            destroy: sinon.stub(),
          },
          journeyModel: {
            reset: sinon.stub(),
            destroy: sinon.stub(),
          },
        }
        res = {
          redirect: sinon.stub(),
        }

        controller.successHandler(req, res)
      })

      it('should reset the journey', function () {
        expect(req.journeyModel.reset).to.have.been.calledOnce
        expect(req.journeyModel.destroy).to.have.been.calledOnce
      })

      it('should reset the session', function () {
        expect(req.sessionModel.reset).to.have.been.calledOnce
        expect(req.sessionModel.destroy).to.have.been.calledOnce
      })

      it('should redirect correctly', function () {
        expect(res.redirect).to.have.been.calledOnce
        expect(res.redirect).to.have.been.calledWith('/')
      })
    })
  })
})
