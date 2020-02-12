const FormController = require('hmpo-form-wizard').Controller
const referenceDataService = require('../../../../common/services/reference-data')
const createFields = require('../../../move/fields/create')
const fieldHelpers = require('../../../../common/helpers/field')

const Controller = require('./assessment')
const controller = new Controller({ route: '/' })

describe('Move controllers', function() {
  describe('Assessment controller', function() {
    let nextSpy
    let refDataService
    let req
    describe('#configure()', function() {
      context('with explicit fields', function() {
        beforeEach(async function() {
          refDataService = sinon.stub(
            referenceDataService,
            'getAssessmentQuestions'
          )
          refDataService.resolves([
            {
              id: 'e6faaf20-3072-4a65-91f7-93d52b16260f',
              type: 'assessment_questions',
              key: 'special_diet_or_allergy',
              category: 'health',
              title: 'Special diet or allergy',
              disabled_at: null,
            },
            {
              id: '1a73d31a-8dd4-47b6-90a0-15ce4e332539',
              type: 'assessment_questions',
              key: 'special_vehicle',
              category: 'health',
              title: 'Special vehicle',
              disabled_at: null,
            },
          ])
          req = {
            form: {
              options: {
                assessmentCategory: 'health',
                fields: {
                  special_diet_or_allergy: {
                    skip: true,
                    rows: 3,
                    component: 'govukTextarea',
                    classes: 'govuk-input--width-20',
                    label: {
                      text: 'fields::assessment_comment.optional',
                      classes: 'govuk-label--s',
                    },
                  },
                  special_vehicle: {
                    skip: true,
                    rows: 3,
                    component: 'govukTextarea',
                    classes: 'govuk-input--width-20',
                    label: {
                      text: 'fields::assessment_comment.required',
                      classes: 'govuk-label--s',
                    },
                    validate: 'required',
                    explicit: true,
                  },
                },
              },
            },
          }
          sinon.stub(FormController.prototype, 'configure')
          nextSpy = sinon.spy()
        })
        afterEach(function() {
          refDataService.reset()
        })

        it('produces the correct result', async function() {
          await controller.configure(req, {}, nextSpy)
          expect(req.form.options.fields).to.deep.equal({
            special_diet_or_allergy: {
              skip: true,
              rows: 3,
              component: 'govukTextarea',
              classes: 'govuk-input--width-20',
              label: {
                text: 'fields::assessment_comment.optional',
                classes: 'govuk-label--s',
              },
              dependent: {
                field: 'health',
                value: 'e6faaf20-3072-4a65-91f7-93d52b16260f',
              },
            },
            special_vehicle: {
              skip: true,
              rows: 3,
              component: 'govukTextarea',
              classes: 'govuk-input--width-20',
              label: {
                text: 'fields::assessment_comment.required',
                classes: 'govuk-label--s',
              },
              validate: 'required',
              explicit: true,
              dependent: {
                field: 'special_vehicle__yesno',
                value: 'yes',
              },
            },
            special_vehicle__yesno: {
              validate: 'required',
              component: 'govukRadios',
              name: 'special_vehicle__yesno',
              fieldset: {
                legend: {
                  text: 'fields::special_vehicle__yesno.label',
                  classes: 'govuk-fieldset__legend--m',
                },
              },
              items: [
                {
                  value: 'yes',
                  text: 'Yes',
                  conditional: 'special_vehicle',
                },
                {
                  value: 'no',
                  text: 'No',
                },
              ],
            },
            health: {
              component: 'govukCheckboxes',
              multiple: true,
              items: [
                {
                  value: 'e6faaf20-3072-4a65-91f7-93d52b16260f',
                  text: 'Special diet or allergy',
                  key: 'special_diet_or_allergy',
                  conditional: 'special_diet_or_allergy',
                },
              ],
              name: 'health',
              fieldset: {
                legend: {
                  text: 'fields::health.label',
                  classes: 'govuk-visually-hidden govuk-fieldset__legend--m',
                },
              },
              hint: {
                text: 'fields::health.hint',
              },
            },
          })
        })
        it('invokes getAssessmentQuestions', async function() {
          await controller.configure(req, {}, nextSpy)
          expect(refDataService).to.be.calledOnceWithExactly('health')
        })
        it('invokes assessmentCategory', async function() {
          sinon.stub(createFields, 'assessmentCategory')
          await controller.configure(req, {}, nextSpy)
          expect(createFields.assessmentCategory).to.be.calledOnceWithExactly(
            'health'
          )
          createFields.assessmentCategory.restore()
        })
        it('invokes mapDependentFields once', async function() {
          sinon.stub(fieldHelpers, 'mapDependentFields')
          await controller.configure(req, {}, nextSpy)
          expect(fieldHelpers.mapDependentFields).to.be.calledOnce
          fieldHelpers.mapDependentFields.restore()
        })
      })
      context('without explicit fields', function() {
        let nextSpy

        beforeEach(function() {
          sinon.spy(FormController.prototype, 'configure')
          sinon.stub(referenceDataService, 'getAssessmentQuestions').resolves([
            {
              id: 'af8cfc67-757c-4019-9d5e-618017de1617',
              type: 'assessment_questions',
              key: 'violent',
              category: 'risk',
              title: 'Violent',
              disabled_at: null,
            },
            {
              id: 'f2db9a8f-a5a9-40cf-875b-d1f5f62b2497',
              type: 'assessment_questions',
              key: 'escape',
              category: 'risk',
              title: 'Escape',
              disabled_at: null,
            },
          ])
          nextSpy = sinon.spy()
        })

        context('by default', function() {
          let req

          beforeEach(async function() {
            nextSpy = sinon.spy()

            req = {
              form: {
                options: {
                  assessmentCategory: 'risk',
                  fields: {
                    risk: {
                      name: 'risk',
                      items: [],
                    },
                    first_names: {
                      name: 'first_names',
                    },
                    violent: {
                      skip: true,
                      rows: 3,
                      component: 'govukTextarea',
                      classes: 'govuk-input--width-20',
                      label: {
                        text: 'fields::assessment_comment.required',
                        classes: 'govuk-label--s',
                      },
                      validate: 'required',
                    },
                  },
                },
              },
            }

            await controller.configure(req, {}, nextSpy)
          })

          it('should not update name field', function() {
            expect(req.form.options.fields.first_names).to.deep.equal({
              name: 'first_names',
            })
          })

          it('should call parent configure method', function() {
            expect(
              FormController.prototype.configure
            ).to.be.calledOnceWithExactly(req, {}, nextSpy)
          })

          it('should not throw an error', function() {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })
        })

        context('when getAssessmentQuestions returns an error', function() {
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

          beforeEach(async function() {
            referenceDataService.getAssessmentQuestions.throws(errorMock)

            await controller.configure(req, {}, nextSpy)
          })

          it('should call next with the error', function() {
            expect(nextSpy).to.be.calledWith(errorMock)
          })

          it('should call next once', function() {
            expect(nextSpy).to.be.calledOnce
          })

          it('should not mutate request object', function() {
            expect(req).to.deep.equal(req)
          })

          it('should not call parent configure method', function() {
            expect(FormController.prototype.configure).not.to.be.called
          })
        })
      })
    })
    describe('#saveValues()', function() {
      let nextSpy
      const mockFields = {
        risk: {
          multiple: true,
          items: [
            {
              key: 'violent',
              text: 'Violent',
              value: 'a1f6a3b5-a448-4a78-8cf7-6659a71661c2',
            },
            {
              key: 'escape',
              text: 'Escape',
              value: '7360ea7b-f4c2-4a09-88fd-5e3b57de1a47',
            },
            {
              key: 'self',
              text: 'Self',
              value: '534b05af-8b55-4a37-9f36-d36a60f04aa8',
            },
          ],
        },
      }

      beforeEach(function() {
        sinon.spy(FormController.prototype, 'saveValues')
        nextSpy = sinon.spy()
      })

      context('with no previous session values', function() {
        let req

        beforeEach(function() {
          req = {
            questions: [
              {
                id: 'a1f6a3b5-a448-4a78-8cf7-6659a71661c2',
                type: 'assessment_questions',
                key: 'violent',
                category: 'risk',
                title: 'Violent',
              },
            ],
            form: {
              options: {
                fields: mockFields,
                assessmentCategory: 'risk',
              },
              values: {
                risk: ['a1f6a3b5-a448-4a78-8cf7-6659a71661c2'],
                violent: 'Additional comments',
              },
            },
            sessionModel: {
              get: sinon.stub().returns(),
              set: sinon.spy(),
              unset: sinon.spy(),
            },
          }

          controller.saveValues(req, {}, nextSpy)
        })

        it('should save values on assessment property', function() {
          expect(req.form.values.assessment).to.deep.equal({
            risk: [
              {
                comments: 'Additional comments',
                assessment_question_id: 'a1f6a3b5-a448-4a78-8cf7-6659a71661c2',
              },
            ],
          })
        })

        it('should flatten values on assessment_answers property', function() {
          expect(req.form.values.person.assessment_answers).to.deep.equal([
            {
              comments: 'Additional comments',
              assessment_question_id: 'a1f6a3b5-a448-4a78-8cf7-6659a71661c2',
            },
          ])
        })

        it('should call parent configure method', function() {
          expect(
            FormController.prototype.saveValues
          ).to.be.calledOnceWithExactly(req, {}, nextSpy)
        })

        it('should not throw an error', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('with previous session values', function() {
        let req, sessionGetStub

        beforeEach(function() {
          sessionGetStub = sinon.stub()
          req = {
            questions: [
              {
                id: 'a1f6a3b5-a448-4a78-8cf7-6659a71661c2',
                type: 'assessment_questions',
                key: 'violent',
                category: 'risk',
                title: 'Violent',
              },
            ],
            form: {
              options: {
                assessmentCategory: 'risk',
                fields: mockFields,
              },
              values: {
                risk: ['a1f6a3b5-a448-4a78-8cf7-6659a71661c2'],
                violent: 'Additional comments',
              },
            },
            sessionModel: {
              get: sessionGetStub,
              set: sinon.spy(),
              unset: sinon.spy(),
            },
          }

          sessionGetStub.withArgs('person').returns({
            first_names: 'Steve',
            last_name: 'Smith',
          })
          sessionGetStub.withArgs('assessment').returns({
            risk: [
              {
                comments: '',
                assessment_question_id: '534b05af-8b55-4a37-9f36-d36a60f04aa8',
              },
            ],
            health: [
              {
                comments: '',
                assessment_question_id: '7360ea7b-f4c2-4a09-88fd-5e3b57de1a47',
              },
            ],
          })

          controller.saveValues(req, {}, nextSpy)
        })

        it('should overwrite values for current field', function() {
          expect(req.form.values.assessment.risk).to.deep.equal([
            {
              comments: 'Additional comments',
              assessment_question_id: 'a1f6a3b5-a448-4a78-8cf7-6659a71661c2',
            },
          ])
        })

        it('should not mutate other assessment fields', function() {
          expect(req.form.values.assessment.health).to.deep.equal([
            {
              comments: '',
              assessment_question_id: '7360ea7b-f4c2-4a09-88fd-5e3b57de1a47',
            },
          ])
        })

        it('should flatten values on assessment_answers property', function() {
          expect(req.form.values.person.assessment_answers).to.deep.equal([
            {
              comments: 'Additional comments',
              assessment_question_id: 'a1f6a3b5-a448-4a78-8cf7-6659a71661c2',
            },
            {
              comments: '',
              assessment_question_id: '7360ea7b-f4c2-4a09-88fd-5e3b57de1a47',
            },
          ])
        })

        it('should call parent configure method', function() {
          expect(
            FormController.prototype.saveValues
          ).to.be.calledOnceWithExactly(req, {}, nextSpy)
        })

        it('should not throw an error', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('with empty values in form', function() {
        let req

        beforeEach(function() {
          req = {
            questions: [
              {
                id: 'a1f6a3b5-a448-4a78-8cf7-6659a71661c2',
                type: 'assessment_questions',
                key: 'violent',
                category: 'risk',
                title: 'Violent',
              },
            ],
            form: {
              options: {
                assessmentCategory: 'risk',
                fields: mockFields,
              },
              values: {
                risk: ['', 'a1f6a3b5-a448-4a78-8cf7-6659a71661c2', '', false],
                violent: '',
              },
            },
            sessionModel: {
              get: sinon.stub().returns(),
              set: sinon.spy(),
              unset: sinon.spy(),
            },
          }

          controller.saveValues(req, {}, nextSpy)
        })

        it('should remove empty values', function() {
          expect(req.form.values.assessment).to.deep.equal({
            risk: [
              {
                comments: '',
                assessment_question_id: 'a1f6a3b5-a448-4a78-8cf7-6659a71661c2',
              },
            ],
          })
        })

        it('should flatten values on assessment_answers property', function() {
          expect(req.form.values.person.assessment_answers).to.deep.equal([
            {
              comments: '',
              assessment_question_id: 'a1f6a3b5-a448-4a78-8cf7-6659a71661c2',
            },
          ])
        })
      })

      context('with multiple values in form', function() {
        let req

        beforeEach(function() {
          req = {
            questions: [
              {
                id: 'a1f6a3b5-a448-4a78-8cf7-6659a71661c2',
                type: 'assessment_questions',
                key: 'violent',
                category: 'risk',
              },
              {
                id: '7360ea7b-f4c2-4a09-88fd-5e3b57de1a47',
                type: 'assessment_questions',
                key: 'escape',
                category: 'risk',
              },
              {
                id: '534b05af-8b55-4a37-9f36-d36a60f04aa8',
                type: 'assessment_questions',
                key: 'self',
                category: 'risk',
              },
            ],
            form: {
              options: {
                assessmentCategory: 'risk',
                fields: mockFields,
              },
              values: {
                risk: [
                  '7360ea7b-f4c2-4a09-88fd-5e3b57de1a47',
                  'a1f6a3b5-a448-4a78-8cf7-6659a71661c2',
                  '534b05af-8b55-4a37-9f36-d36a60f04aa8',
                ],
                violent: 'Violent comments',
                escape: 'Escape comments',
                self: 'Self comments',
              },
            },
            sessionModel: {
              get: sinon.stub().returns(),
              set: sinon.spy(),
              unset: sinon.spy(),
            },
          }

          controller.saveValues(req, {}, nextSpy)
        })

        it('should include all values', function() {
          expect(req.form.values.assessment).to.deep.equal({
            risk: [
              {
                comments: 'Violent comments',
                assessment_question_id: 'a1f6a3b5-a448-4a78-8cf7-6659a71661c2',
              },
              {
                comments: 'Escape comments',
                assessment_question_id: '7360ea7b-f4c2-4a09-88fd-5e3b57de1a47',
              },
              {
                comments: 'Self comments',
                assessment_question_id: '534b05af-8b55-4a37-9f36-d36a60f04aa8',
              },
            ],
          })
        })

        it('should includes all flatten values on assessment_answers property', function() {
          expect(req.form.values.person.assessment_answers.length).to.equal(3)
          expect(req.form.values.person.assessment_answers).to.deep.equal([
            {
              comments: 'Violent comments',
              assessment_question_id: 'a1f6a3b5-a448-4a78-8cf7-6659a71661c2',
            },
            {
              comments: 'Escape comments',
              assessment_question_id: '7360ea7b-f4c2-4a09-88fd-5e3b57de1a47',
            },
            {
              comments: 'Self comments',
              assessment_question_id: '534b05af-8b55-4a37-9f36-d36a60f04aa8',
            },
          ])
        })
      })
    })
  })
})
