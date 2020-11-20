const proxyquire = require('proxyquire')

const FrameworkSectionController = require('../controllers/framework/framework-section')
const FrameworkStepController = require('../controllers/framework/framework-step')

const wizardReqStub = sinon.stub()
const wizardStub = sinon.stub().returns(wizardReqStub)

const router = proxyquire('./framework-form-wizard', {
  'hmpo-form-wizard': wizardStub,
})

const mockFramework = {
  questions: {
    'question-1': {},
    'question-2': {},
    'question-3': {},
  },
  sections: {
    frameworkSectionOne: {
      key: 'section-one',
      steps: {
        '/step-1': {},
        '/step-2': {},
        '/step-3': {},
      },
    },
    frameworkSectionTwo: {
      key: 'section-two',
      steps: {
        '/step-1': {},
        '/step-2': {},
      },
    },
    frameworkSectionThree: {
      key: 'section-three',
      steps: {
        '/step-1': {},
        '/step-2': {},
        '/step-3': {},
        '/step-4': {},
      },
    },
  },
}

describe('Framework form wizard', function () {
  describe('#defineFormWizard', function () {
    let req, res, next

    beforeEach(function () {
      req = {
        assessment: {
          _framework: mockFramework,
          id: '12345',
          framework: {
            name: 'person-escort-record',
          },
        },
        frameworkSection: {
          key: 'section-one',
          steps: {
            '/step-1': {},
            '/step-2': {},
            '/step-3': {},
          },
        },
      }
      res = {}
      next = sinon.spy()

      router.defineFormWizard(req, res, next)
    })

    afterEach(function () {
      wizardStub.resetHistory()
      wizardReqStub.resetHistory()
    })

    describe('form wizard', function () {
      it('should call form wizard with correct number of arguments', function () {
        expect(wizardStub.args[0]).to.have.length(3)
      })

      it('should call form wizard with steps', function () {
        const steps = {
          '/': {
            controller: FrameworkSectionController,
            reset: true,
            resetJourney: true,
            template: 'framework-section',
          },
          '/start': {
            reset: true,
            resetJourney: true,
            skip: true,
            noPost: true,
            next: Object.values(req.frameworkSection.steps)[0].slug,
          },
          ...req.frameworkSection.steps,
        }
        const config = {
          controller: FrameworkStepController,
          entryPoint: true,
          journeyName: `${req.assessment.framework.name}-${req.assessment.id}-${req.frameworkSection.key}`,
          journeyPageTitle: 'Person Escort Record',
          name: `${req.assessment.framework.name}-${req.assessment.id}-${req.frameworkSection.key}`,
          template: 'framework-step',
          defaultFormatters: ['trim', 'singlespaces', 'apostrophes', 'quotes'],
        }

        expect(wizardStub).to.be.calledWithExactly(
          steps,
          mockFramework.questions,
          config
        )
      })

      it('should call form wizard with steps', function () {
        expect(wizardReqStub).to.be.calledWithExactly(req, res, next)
      })
    })
  })
})
