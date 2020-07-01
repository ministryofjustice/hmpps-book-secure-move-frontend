const proxyquire = require('proxyquire')

const { FrameworksController } = require('./controllers')
const middleware = require('./middleware')

const wizardReqStub = sinon.stub()
const wizardStub = sinon.stub().returns(wizardReqStub)

const router = proxyquire('./router', {
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

describe('Person Escort Record router', function () {
  describe('#defineFormWizards', function () {
    let mockRouter

    beforeEach(function () {
      mockRouter = {
        use: sinon.stub(),
      }
      sinon.stub(middleware, 'setFramework')

      router.defineFormWizards(mockFramework, mockRouter)
    })

    afterEach(function () {
      wizardStub.resetHistory()
      wizardReqStub.resetHistory()
    })

    describe('router', function () {
      it('should setup setFramework middleware', function () {
        expect(mockRouter.use).to.be.calledWithExactly(
          middleware.setFramework()
        )
        expect(middleware.setFramework).to.be.calledWithExactly(mockFramework)
      })

      it('should call use correct number of times', function () {
        expect(mockRouter.use.callCount).to.equal(4)
      })

      it('should setup router with form wizards', function () {
        for (const [key, value] of Object.entries(mockFramework.sections)) {
          const steps = {
            '/': {
              reset: true,
              resetJourney: true,
            },
            ...value.steps,
          }
          const config = {
            controller: FrameworksController,
            entryPoint: true,
            journeyName: `person-escort-record-${key}`,
            journeyPageTitle: 'Person escort record',
            name: `person-escort-record-${key}`,
            template: 'form-step',
            templatePath: 'person-escort-record/views/',
          }

          expect(mockRouter.use).to.be.calledWithExactly(
            `/${key}`,
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
            },
            ...value.steps,
          }
          const config = {
            controller: FrameworksController,
            entryPoint: true,
            journeyName: `person-escort-record-${key}`,
            journeyPageTitle: 'Person escort record',
            name: `person-escort-record-${key}`,
            template: 'form-step',
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
  })
})
