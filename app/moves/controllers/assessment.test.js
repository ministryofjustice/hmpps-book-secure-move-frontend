const FormController = require('hmpo-form-wizard').Controller

const Controller = require('./assessment')
const referenceDataService = require('../../../common/services/reference-data')

const controller = new Controller({ route: '/' })

const questionsMock = [
  {
    id: 'd3a50d7a-6cf4-4eeb-a013-1ff8c5c47cc1',
    type: 'profile_attribute_types',
    category: 'risk',
    user_type: 'police',
    description: 'Violent',
    alert_type: null,
    alert_code: null,
  },
  {
    id: '9b978b79-d19b-4a15-b3fe-9e45570cac70',
    type: 'profile_attribute_types',
    category: 'risk',
    user_type: 'police',
    description: 'Escape',
    alert_type: null,
    alert_code: null,
  },
]

describe('Moves controllers', function () {
  describe('Assessment controller', function () {
    describe('#configure()', function () {
      let nextSpy

      beforeEach(function () {
        sinon.spy(FormController.prototype, 'configure')
        nextSpy = sinon.spy()
      })

      context('when reference resolves', function () {
        let req

        beforeEach(async function () {
          sinon.stub(referenceDataService, 'getAssessmentQuestions').resolves(questionsMock)
          nextSpy = sinon.spy()

          req = {
            form: {
              options: {
                fields: {
                  risk: {
                    name: 'risk',
                    items: [],
                  },
                  first_names: {
                    name: 'first_names',
                  },
                },
              },
            },
          }

          await controller.configure(req, {}, nextSpy)
        })

        it('should update risk field items', function () {
          expect(req.form.options.fields.risk).to.deep.equal({
            name: 'risk',
            items: [
              { value: 'd3a50d7a-6cf4-4eeb-a013-1ff8c5c47cc1', text: 'Violent' },
              { value: '9b978b79-d19b-4a15-b3fe-9e45570cac70', text: 'Escape' },
            ],
          })
        })

        it('should not update name field', function () {
          expect(req.form.options.fields.first_names).to.deep.equal({
            name: 'first_names',
          })
        })

        it('should call parent configure method', function () {
          expect(FormController.prototype.configure).to.be.calledOnce
          expect(FormController.prototype.configure).to.be.calledWith(req, {}, nextSpy)
        })

        it('should not throw an error', function () {
          expect(nextSpy).to.be.calledOnce
          expect(nextSpy).to.be.calledWith()
        })
      })

      context('when getReferenceData returns an error', function () {
        const errorMock = new Error('Problem')
        const req = {
          form: {
            options: {
              fields: {
                risk: {
                  name: 'risk',
                  items: [],
                },
              },
            },
          },
        }

        beforeEach(async function () {
          sinon.stub(referenceDataService, 'getAssessmentQuestions').rejects(errorMock)

          await controller.configure(req, {}, nextSpy)
        })

        it('should call next with the error', function () {
          expect(nextSpy).to.be.calledWith(errorMock)
        })

        it('should call next once', function () {
          expect(nextSpy).to.be.calledOnce
        })

        it('should not mutate request object', function () {
          expect(req).to.deep.equal(req)
        })

        it('should not call parent configure method', function () {
          expect(FormController.prototype.configure).not.to.be.called
        })
      })
    })
  })
})
