const fieldHelpers = require('../../../../common/helpers/field')
const presenters = require('../../../../common/presenters')
const referenceDataService = require('../../../../common/services/reference-data')

const Controller = require('./assessment')
const BaseController = require('./base')
const controller = new Controller({ route: '/' })

describe('Move controllers', function () {
  describe('Assessment controller', function () {
    describe('#configure()', function () {
      let nextSpy
      let req
      let profileService

      beforeEach(function () {
        profileService = {
          create: sinon.stub().resolves({
            id: '#profile',
            person: {
              id: '#person',
            },
          }),
        }
        req = {
          services: {
            profile: profileService,
          },
        }
        sinon.stub(BaseController.prototype, 'configure')
        sinon.stub(referenceDataService, 'getAssessmentQuestions')
        sinon.stub(fieldHelpers, 'populateAssessmentFields')
        nextSpy = sinon.spy()
      })

      context('when getAssessmentQuestions resolves', function () {
        const mockQuestionsResponse = [
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
        ]
        const mockPopulateAssessmentFieldsResponse = {
          foo: 'bar',
        }
        const mockFields = {
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
            explicit: true,
          },
        }

        beforeEach(async function () {
          fieldHelpers.populateAssessmentFields.returns(
            mockPopulateAssessmentFieldsResponse
          )
          referenceDataService.getAssessmentQuestions.resolves(
            mockQuestionsResponse
          )
          req = {
            form: {
              options: {
                assessmentCategory: 'risk',
                fields: mockFields,
              },
            },
          }

          await controller.configure(req, {}, nextSpy)
        })

        it('invokes getAssessmentQuestions', function () {
          expect(
            referenceDataService.getAssessmentQuestions
          ).to.be.calledOnceWithExactly('risk')
        })

        it('should call populateAssessmentFields', function () {
          expect(
            fieldHelpers.populateAssessmentFields
          ).to.be.calledOnceWithExactly(mockFields, mockQuestionsResponse)
        })

        it('should set fields to populateAssessmentFields reponse', function () {
          expect(req.form.options.fields).to.deep.equal(
            mockPopulateAssessmentFieldsResponse
          )
        })

        it('should set questions on request', function () {
          expect(req.questions).to.deep.equal(mockQuestionsResponse)
        })

        it('should call parent configure method', function () {
          expect(
            BaseController.prototype.configure
          ).to.be.calledOnceWithExactly(req, {}, nextSpy)
        })
      })

      context('when getAssessmentQuestions returns an error', function () {
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
          referenceDataService.getAssessmentQuestions.throws(errorMock)

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
          expect(BaseController.prototype.configure).not.to.be.called
        })
      })
    })

    describe('#middlewareLocals()', function () {
      beforeEach(function () {
        sinon.stub(BaseController.prototype, 'middlewareLocals')
        sinon.stub(controller, 'use')

        controller.middlewareLocals()
      })

      it('should call parent method', function () {
        expect(BaseController.prototype.middlewareLocals).to.have.been
          .calledOnce
      })

      it('should call set previous assessment method', function () {
        expect(controller.use.firstCall).to.have.been.calledWithExactly(
          controller.setPreviousAssessment
        )
      })

      it('should call correct number of middleware', function () {
        expect(controller.use).to.be.callCount(1)
      })
    })

    describe('#setPreviousAssessment', function () {
      let req, res, nextSpy, profileService
      const mockProfile = {
        id: '#profile',
        assessment_answers: [
          {
            category: 'risk',
            key: 'violent',
            imported_from_nomis: true,
          },
          {
            category: 'risk',
            key: 'escape',
            imported_from_nomis: true,
          },
          {
            category: 'risk',
            key: 'self_harm',
            imported_from_nomis: true,
          },
          {
            category: 'health',
            key: 'medication',
            imported_from_nomis: true,
          },
          {
            category: 'court',
            key: 'interpreter',
            imported_from_nomis: true,
          },
        ],
      }

      beforeEach(function () {
        profileService = {
          create: sinon.stub().resolves(mockProfile),
        }
        sinon.stub(presenters, 'assessmentAnswersByCategory').returns([
          {
            key: 'health',
            answers: ['stubbed'],
          },
          {
            key: 'risk',
            answers: ['stubbed'],
          },
        ])
        sinon
          .stub(presenters, 'assessmentCategoryToPanelComponent')
          .returnsArg(0)
        req = {
          getPerson: sinon.stub().returns({ id: '#person' }),
          getProfile: sinon.stub().returns(mockProfile),
          sessionModel: {
            set: sinon.stub(),
          },
          form: {
            options: {
              assessmentCategory: 'risk',
              fields: {
                violent: {},
                self_harm: {},
                escape: {},
              },
            },
          },
          services: {
            profile: profileService,
          },
        }
        res = {
          locals: {},
        }
        nextSpy = sinon.spy()
      })

      context('when no profile exists', function () {
        beforeEach(async function () {
          req.getProfile.returns({})
          await controller.setPreviousAssessment(req, res, nextSpy)
        })

        it('should create a profile', function () {
          expect(profileService.create).to.be.calledOnceWithExactly(
            '#person',
            {}
          )
        })

        it('should stash the profile on the session', function () {
          expect(req.sessionModel.set).to.be.calledOnceWithExactly(
            'profile',
            mockProfile
          )
        })
      })

      context('when the step should show previous assessment', function () {
        beforeEach(function () {
          req.form.options.showPreviousAssessment = true
        })

        context('with no custom groupings', function () {
          beforeEach(function () {
            controller.setPreviousAssessment(req, res, nextSpy)
          })

          it('should set previous assessment on local', function () {
            expect(res.locals).to.contain.property('previousAnswers')
            expect(res.locals.previousAnswers).to.deep.equal({
              key: 'risk',
              answers: ['stubbed'],
            })
          })

          it('should set empty custom groupings on local', function () {
            expect(res.locals).to.contain.property('customAnswerGroupings')
            expect(res.locals.customAnswerGroupings).to.deep.equal([])
          })

          it('should call presenter with filtered assessment', function () {
            expect(
              presenters.assessmentAnswersByCategory
            ).to.be.calledOnceWithExactly([
              {
                category: 'risk',
                key: 'violent',
                imported_from_nomis: true,
              },
              {
                category: 'risk',
                key: 'escape',
                imported_from_nomis: true,
              },
              {
                category: 'risk',
                key: 'self_harm',
                imported_from_nomis: true,
              },
            ])
          })

          it('should call next', function () {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })
        })

        context('with custom groupings', function () {
          beforeEach(function () {
            req.form.options.customAssessmentGroupings = [
              {
                i18nContext: 'escape',
                keys: ['escape'],
              },
            ]
            controller.setPreviousAssessment(req, res, nextSpy)
          })

          it('should call presenter with filtered assessment', function () {
            expect(
              presenters.assessmentAnswersByCategory
            ).to.be.calledWithExactly([
              {
                category: 'risk',
                key: 'violent',
                imported_from_nomis: true,
              },
              {
                category: 'risk',
                key: 'self_harm',
                imported_from_nomis: true,
              },
            ])
          })

          it('should call presenter with custom assessment', function () {
            expect(
              presenters.assessmentAnswersByCategory
            ).to.be.calledWithExactly([
              {
                category: 'risk',
                key: 'escape',
                imported_from_nomis: true,
              },
            ])
          })

          it('should call presenter custom number of times', function () {
            expect(presenters.assessmentAnswersByCategory.callCount).to.equal(2)
          })

          it('should set previous assessment on local', function () {
            expect(res.locals).to.contain.property('previousAnswers')
            expect(res.locals.previousAnswers).to.deep.equal({
              key: 'risk',
              answers: ['stubbed'],
            })
          })

          it('should set empty custom groupings on local', function () {
            expect(res.locals).to.contain.property('customAnswerGroupings')
            expect(res.locals.customAnswerGroupings).to.deep.equal([
              {
                key: 'escape',
                answers: ['stubbed'],
              },
            ])
          })

          it('should call next', function () {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })
        })

        context('with non imported answers', function () {
          beforeEach(function () {
            req.getProfile.returns({
              id: '#profile',
              assessment_answers: [
                {
                  category: 'risk',
                  key: 'violent',
                  imported_from_nomis: true,
                },
                {
                  category: 'risk',
                  key: 'self_harm',
                },
                {
                  category: 'risk',
                  key: 'escape',
                },
              ],
            })
            controller.setPreviousAssessment(req, res, nextSpy)
          })

          it('should call presenter with filtered assessment', function () {
            expect(
              presenters.assessmentAnswersByCategory
            ).to.be.calledOnceWithExactly([
              {
                category: 'risk',
                key: 'violent',
                imported_from_nomis: true,
              },
            ])
          })
        })
      })

      context(
        'when the step should not include previous assessment',
        function () {
          beforeEach(function () {
            controller.setPreviousAssessment(req, res, nextSpy)
          })

          it('should not set previous assessment on locals', function () {
            expect(res.locals).not.to.contain.property('previousAnswers')
            expect(res.locals).not.to.contain.property('customAnswerGroupings')
          })

          it('should not call presenters', function () {
            expect(presenters.assessmentAnswersByCategory).not.to.be.called
            expect(presenters.assessmentCategoryToPanelComponent).not.to.be
              .called
          })

          it('should call next', function () {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })
        }
      )
    })

    describe('#saveValues()', function () {
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

      beforeEach(function () {
        sinon.stub(BaseController.prototype, 'saveValues')
        nextSpy = sinon.spy()
      })

      context('with no previous session values', function () {
        let req

        beforeEach(function () {
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

        it('should save values on assessment property', function () {
          expect(req.form.values.assessment).to.deep.equal({
            risk: [
              {
                comments: 'Additional comments',
                key: 'violent',
                assessment_question_id: 'a1f6a3b5-a448-4a78-8cf7-6659a71661c2',
              },
            ],
          })
        })

        it('should call parent configure method', function () {
          expect(
            BaseController.prototype.saveValues
          ).to.be.calledOnceWithExactly(req, {}, nextSpy)
        })
      })

      context('with previous session values', function () {
        let req, sessionGetStub

        beforeEach(function () {
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

        it('should overwrite values for current field', function () {
          expect(req.form.values.assessment.risk).to.deep.equal([
            {
              comments: 'Additional comments',
              key: 'violent',
              assessment_question_id: 'a1f6a3b5-a448-4a78-8cf7-6659a71661c2',
            },
          ])
        })

        it('should not mutate other assessment fields', function () {
          expect(req.form.values.assessment.health).to.deep.equal([
            {
              comments: '',
              assessment_question_id: '7360ea7b-f4c2-4a09-88fd-5e3b57de1a47',
            },
          ])
        })

        it('should call parent configure method', function () {
          expect(
            BaseController.prototype.saveValues
          ).to.be.calledOnceWithExactly(req, {}, nextSpy)
        })
      })

      context('with empty values in form', function () {
        let req

        beforeEach(function () {
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

        it('should remove empty values', function () {
          expect(req.form.values.assessment).to.deep.equal({
            risk: [
              {
                comments: '',
                key: 'violent',
                assessment_question_id: 'a1f6a3b5-a448-4a78-8cf7-6659a71661c2',
              },
            ],
          })
        })
      })

      context('with multiple values in form', function () {
        let req

        beforeEach(function () {
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
              {
                id: '29f8177c-2cf8-41e8-b1ad-1f66c3a1fda0',
                type: 'assessment_questions',
                key: 'bully',
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
                violent_explicit: 'Violent comments',
                violent: 'Violent comments',
                escape: 'Escape comments',
                self: 'Self comments',
                bully_explicit: '29f8177c-2cf8-41e8-b1ad-1f66c3a1fda0',
                bully: 'Bully comments',
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

        it('should include all values', function () {
          expect(req.form.values.assessment).to.deep.equal({
            risk: [
              {
                comments: 'Violent comments',
                key: 'violent',
                assessment_question_id: 'a1f6a3b5-a448-4a78-8cf7-6659a71661c2',
              },
              {
                comments: 'Escape comments',
                key: 'escape',
                assessment_question_id: '7360ea7b-f4c2-4a09-88fd-5e3b57de1a47',
              },
              {
                comments: 'Self comments',
                key: 'self',
                assessment_question_id: '534b05af-8b55-4a37-9f36-d36a60f04aa8',
              },
              {
                comments: 'Bully comments',
                key: 'bully',
                assessment_question_id: '29f8177c-2cf8-41e8-b1ad-1f66c3a1fda0',
              },
            ],
          })
        })
      })
    })
  })
})
