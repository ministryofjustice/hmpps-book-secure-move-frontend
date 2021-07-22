const CreateAssessment = require('../../new/controllers/assessment')

const MixinProto = CreateAssessment.prototype
const AssessmentController = require('./assessment')
const UpdateBaseController = require('./base')

const controller = new AssessmentController({ route: '/' })
const ownProto = Object.getPrototypeOf(controller)

const mockProfile = {
  id: '#profileId',
  assessment_answers: [
    {
      title: 'Violent',
      comments: '#original_value',
      created_at: '2020-04-10',
      expires_at: null,
      assessment_question_id: 'af8cfc67-757c-4019-9d5e-618017de1617',
      category: 'risk',
      key: 'violent',
      nomis_alert_type: null,
      nomis_alert_code: null,
      nomis_alert_type_description: null,
      nomis_alert_description: null,
      imported_from_nomis: null,
    },
  ],
}

describe('Move controllers', function () {
  describe('Update assessment controller', function () {
    it('should extend UpdateBaseController', function () {
      expect(Object.getPrototypeOf(ownProto)).to.equal(
        UpdateBaseController.prototype
      )
    })

    describe('When mixing in create controller', function () {
      it('should copy configure from CreateAssessment', function () {
        expect(controller.configure).to.exist.and.equal(MixinProto.configure)
      })

      it('should copy setPreviousAssessment from CreateAssessment', function () {
        expect(controller.setPreviousAssessment).to.exist.and.equal(
          MixinProto.setPreviousAssessment
        )
      })

      it('should copy getAssessments from CreateAssessment', function () {
        expect(controller.getAssessments).to.exist.and.equal(
          MixinProto.getAssessments
        )
      })

      it('should not copy saveValues from CreateAssessment', function () {
        expect(controller.saveValues).to.exist.and.not.be.equal(
          MixinProto.saveValues
        )
      })

      it('should only have the expected methods of its own', function () {
        const ownMethods = ['getUpdateValues', 'saveValues']
        const mixedinMethods = Object.getOwnPropertyNames(MixinProto)
        const ownProps = Object.getOwnPropertyNames(ownProto).filter(
          prop => !mixedinMethods.includes(prop) || ownMethods.includes(prop)
        )
        expect(ownProps).to.deep.equal(ownMethods)
      })
    })

    describe('#middlewareLocals()', function () {
      beforeEach(function () {
        sinon.stub(UpdateBaseController.prototype, 'middlewareLocals')
        sinon.stub(controller, 'use')

        controller.middlewareLocals()
      })

      it('should call parent method', function () {
        expect(UpdateBaseController.prototype.middlewareLocals).to.have.been
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

    describe('#getUpdateValues', function () {
      let req, profileService
      const res = {}

      beforeEach(function () {
        profileService = {
          update: sinon.stub().resolves(),
          unformat: sinon.stub(),
        }
        sinon.stub(controller, 'setFlash')
        req = {
          getProfile: sinon.stub().returns(mockProfile),
          form: {
            options: {
              fields: {
                violent: {},
                escape: {},
              },
            },
          },
          services: {
            profile: profileService,
          },
        }
      })

      context('When assessment answers are unchanged', function () {
        it('should not update the profile data', async function () {
          await controller.getUpdateValues(req, res)
          expect(profileService.unformat).to.be.calledOnceWithExactly(
            mockProfile,
            ['violent', 'escape']
          )
        })
      })
    })

    describe('#saveValues', function () {
      let req, profileService
      const res = {}
      let nextSpy

      beforeEach(function () {
        profileService = {
          update: sinon.stub().resolves(),
        }
        sinon.stub(controller, 'setFlash')
        req = {
          getProfile: sinon.stub().returns(mockProfile),
          form: {
            values: {
              violent: '#original_value',
              escape: '',
              hold_separately: '',
              self_harm: '',
              concealed_items: '',
              other_risks: '',
              risk: ['af8cfc67-757c-4019-9d5e-618017de1617'],
            },
            options: {
              fields: {
                violent: {},
                escape: {},
                hold_separately: {},
                self_harm: {},
                concealed_items: {},
                other_risks: {},
              },
            },
          },
          questions: [
            {
              id: 'af8cfc67-757c-4019-9d5e-618017de1617',
              type: 'assessment_questions',
              key: 'violent',
              category: 'risk',
            },
            {
              id: 'f2db9a8f-a5a9-40cf-875b-d1f5f62b2497',
              type: 'assessment_questions',
              key: 'escape',
              category: 'risk',
            },
            {
              id: '8f38efb0-36c1-4a56-8c66-3b72c9525f92',
              type: 'assessment_questions',
              key: 'hold_separately',
              category: 'risk',
            },
            {
              id: '4e7e54b4-a40c-488f-bdff-c6b2268ca4eb',
              type: 'assessment_questions',
              key: 'self_harm',
              category: 'risk',
            },
            {
              id: '56826f64-da5d-42eb-b360-131e60bcc3d3',
              type: 'assessment_questions',
              key: 'concealed_items',
              category: 'risk',
            },
            {
              id: '4e37ac1a-a461-45a8-bca9-f0e994d3105e',
              type: 'assessment_questions',
              key: 'other_risks',
              category: 'risk',
            },
            {
              id: '3a661bc8-5536-43e9-bcea-0a4d9651a175',
              type: 'assessment_questions',
              key: 'not_for_release',
              category: 'risk',
            },
            {
              id: 'bafcde0b-46e9-44b2-ad20-de3644256a42',
              type: 'assessment_questions',
              key: 'not_to_be_released',
              category: 'risk',
            },
          ],
          services: {
            profile: profileService,
          },
        }
        nextSpy = sinon.spy()
      })

      context('When assessment answers are unchanged', function () {
        it('should not update the profile data', async function () {
          await controller.saveValues(req, res, nextSpy)
          expect(profileService.update).to.not.be.called
        })

        it('should not set the confirmation message', async function () {
          await controller.saveValues(req, res, nextSpy)
          expect(controller.setFlash).to.not.be.called
        })
      })

      context('When assessment answers have changed', function () {
        beforeEach(async function () {
          req.form.values.violent = '#violent'
          await controller.saveValues(req, res, nextSpy)
        })

        it('should update the profile data', function () {
          expect(profileService.update).to.be.calledOnceWithExactly({
            assessment_answers: [
              {
                assessment_question_id: 'af8cfc67-757c-4019-9d5e-618017de1617',
                comments: '#violent',
                key: 'violent',
              },
            ],
            id: '#profileId',
          })
        })

        it('should set the confirmation message', function () {
          expect(controller.setFlash).to.be.calledOnceWithExactly(req)
        })
      })

      context('When assessment comment has been deleted', function () {
        beforeEach(function () {
          req.form.values.violent = ''
        })

        it('should remove the comment from the assessment answer', async function () {
          await controller.saveValues(req, res, nextSpy)
          expect(profileService.update).to.be.calledOnceWithExactly({
            assessment_answers: [
              {
                assessment_question_id: 'af8cfc67-757c-4019-9d5e-618017de1617',
                comments: '',
                key: 'violent',
              },
            ],
            id: '#profileId',
          })
        })
      })

      context('When assessment item is checked', function () {
        beforeEach(function () {
          req.form.values.risk.push('56826f64-da5d-42eb-b360-131e60bcc3d3')
          req.form.values.risk.push('4e7e54b4-a40c-488f-bdff-c6b2268ca4eb')
        })

        it('should add the assessment answer and order the assessments', async function () {
          await controller.saveValues(req, res, nextSpy)
          expect(profileService.update).to.be.calledOnceWithExactly({
            assessment_answers: [
              {
                assessment_question_id: '4e7e54b4-a40c-488f-bdff-c6b2268ca4eb',
                comments: '',
                key: 'self_harm',
              },
              {
                assessment_question_id: '56826f64-da5d-42eb-b360-131e60bcc3d3',
                comments: '',
                key: 'concealed_items',
              },
              {
                assessment_question_id: 'af8cfc67-757c-4019-9d5e-618017de1617',
                comments: '#original_value',
                key: 'violent',
              },
            ],
            id: '#profileId',
          })
        })
      })

      context('When there were no assessment answers originally', function () {
        beforeEach(function () {
          req.getProfile.returns({ id: '#profileId' })
        })

        it('should update the person data', async function () {
          await controller.saveValues(req, res, nextSpy)
          expect(profileService.update).to.be.calledOnceWithExactly({
            assessment_answers: [
              {
                assessment_question_id: 'af8cfc67-757c-4019-9d5e-618017de1617',
                comments: '#original_value',
                key: 'violent',
              },
            ],
            id: '#profileId',
          })
        })
      })

      context('When person API fails', function () {
        const err = new Error()
        beforeEach(function () {
          req.form.values.violent = '#changeme'
          profileService.update.throws(err)
        })

        it('should call next with the error thrown', async function () {
          try {
            await controller.saveValues(req, res, nextSpy)
          } catch (error) {}

          expect(nextSpy).to.be.calledOnceWithExactly(err)
        })
      })
    })
  })
})
