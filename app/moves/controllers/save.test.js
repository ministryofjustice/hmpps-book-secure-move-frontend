const FormController = require('hmpo-form-wizard').Controller

const Controller = require('./save')
const moveService = require('../../../common/services/move')
const personService = require('../../../common/services/person')
const filters = require('../../../config/nunjucks/filters')

const controller = new Controller({ route: '/' })

const { data: moveMock } = require('../../../test/fixtures/api-client/move.get.deserialized.json')
const fullname = `${moveMock.person.last_name}, ${moveMock.person.first_names}`
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
            set: sinon.stub(),
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

        it('should set response to session model', function () {
          expect(req.sessionModel.set).to.be.calledWith('move', moveMock)
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
            get: sinon.stub().withArgs('move').returns(moveMock),
            reset: sinon.stub(),
            destroy: sinon.stub(),
          },
          journeyModel: {
            reset: sinon.stub(),
            destroy: sinon.stub(),
          },
          flash: sinon.stub(),
        }
        res = {
          redirect: sinon.stub(),
        }

        sinon.stub(personService, 'getFullname').returns(fullname)
        sinon.stub(filters, 'formatDateWithDay').returnsArg(0)
        controller.successHandler(req, res)
      })

      it('should set a success message', function () {
        expect(req.flash).to.have.been.calledOnceWith('success', {
          title: 'Move scheduled',
          content: `Move for <strong>${fullname}</strong> to <strong>${moveMock.to_location.title}</strong> on <strong>${moveMock.date}</strong> has been scheduled.`,
        })
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
