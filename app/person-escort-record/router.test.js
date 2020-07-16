const proxyquire = require('proxyquire')

const {
  FrameworkSectionController,
  FrameworksController,
} = require('./controllers')
const middleware = require('./middleware')

const wizardReqStub = sinon.stub()
const wizardStub = sinon.stub().returns(wizardReqStub)
const mockRouter = {
  use: sinon.stub(),
}

const router = proxyquire('./router', {
  'hmpo-form-wizard': wizardStub,
  express: {
    Router: () => mockRouter,
  },
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

describe('Person Escort Record router', function () {
  describe('#defineFormWizards', function () {
    let output

    beforeEach(function () {
      sinon.stub(middleware, 'setFrameworkSection')

      output = router.defineFormWizards(mockFramework)
    })

    afterEach(function () {
      mockRouter.use.resetHistory()
      wizardStub.resetHistory()
      wizardReqStub.resetHistory()
    })

    describe('router', function () {
      it('should call use correct number of times', function () {
        expect(mockRouter.use.callCount).to.equal(3)
      })

      it('should setup router with form wizards', function () {
        for (const [key, value] of Object.entries(mockFramework.sections)) {
          const steps = {
            '/': {
              reset: true,
              resetJourney: true,
              skip: true,
              next: Object.values(value.steps)[0].slug,
            },
            ...value.steps,
            '/overview': {
              controller: FrameworkSectionController,
              reset: true,
              resetJourney: true,
              template: 'framework-section',
            },
          }
          const config = {
            controller: FrameworksController,
            entryPoint: true,
            journeyName: `person-escort-record-${key}`,
            journeyPageTitle: 'Person escort record',
            name: `person-escort-record-${key}`,
            template: 'framework-step',
            templatePath: 'person-escort-record/views/',
          }

          expect(mockRouter.use).to.be.calledWithExactly(
            `/${key}`,
            middleware.setFrameworkSection(value),
            wizardStub(steps, mockFramework.questions, config)
          )
        }
      })
    })

    describe('form wizard', function () {
      const sectionCount = Object.keys(mockFramework.sections).length

      it('should call form wizard correct number of times', function () {
        expect(wizardStub.callCount).to.equal(sectionCount)
      })

      it('should call form wizard with correct number of arguments', function () {
        for (let index = 0; index < sectionCount.length; index++) {
          expect(wizardStub.args[index]).to.have.length(3)
        }
      })

      it('should call form wizard with steps', function () {
        for (const [key, value] of Object.entries(mockFramework.sections)) {
          const steps = {
            '/': {
              reset: true,
              resetJourney: true,
              skip: true,
              next: Object.values(value.steps)[0].slug,
            },
            ...value.steps,
            '/overview': {
              controller: FrameworkSectionController,
              reset: true,
              resetJourney: true,
              template: 'framework-section',
            },
          }
          const config = {
            controller: FrameworksController,
            entryPoint: true,
            journeyName: `person-escort-record-${key}`,
            journeyPageTitle: 'Person escort record',
            name: `person-escort-record-${key}`,
            template: 'framework-step',
            templatePath: 'person-escort-record/views/',
          }

          expect(wizardStub).to.be.calledWithExactly(
            steps,
            mockFramework.questions,
            config
          )
        }
      })
    })

    it('should return a router', function () {
      expect(output).to.deep.equal(mockRouter)
    })
  })
})
