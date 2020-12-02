const proxyquire = require('proxyquire')
const mockPopulationService = {}

const FormWizardController = require('../../../common/controllers/form-wizard')

const Controller = proxyquire('./edit', {
  '../../../common/services/population': mockPopulationService,
})

describe('Population controllers', function () {
  describe('#edit()', function () {
    let req
    let res
    let next
    let controllerInstance
    let sessionData
    let username

    beforeEach(function () {
      username = 'user.fullname'
      sessionData = { key: 'value' }
      req = {
        date: '2020-06-01',
        locationId: 'DEADBEEF',

        sessionModel: {
          toJSON: sinon.stub().returns(sessionData),
          reset: sinon.fake(),
          set: sinon.fake(),
        },
        journeyModel: {
          reset: sinon.fake(),
          get: sinon.stub(),
        },
        form: {
          options: {
            fullPath: '/details',
          },
        },
      }
      res = {
        redirect: sinon.fake(),
        locals: {},
      }

      next = sinon.fake()

      controllerInstance = new Controller({ route: '/' })
    })

    describe('middlewareLocals', function () {
      beforeEach(function () {
        sinon.stub(FormWizardController.prototype, 'middlewareLocals')
        sinon.stub(controllerInstance, 'use')

        controllerInstance.middlewareLocals()
      })

      it('should call parent method', function () {
        expect(FormWizardController.prototype.middlewareLocals).to.have.been
          .calledOnce
      })

      it('should call set button text method', function () {
        expect(
          controllerInstance.use.getCall(0)
        ).to.have.been.calledWithExactly(controllerInstance.setButtonText)
      })

      it('should call correct number of middleware', function () {
        expect(controllerInstance.use).to.be.callCount(1)
      })
    })
    describe('setInitialValues', function () {
      context('on first page visit', function () {
        beforeEach(async function () {
          req.population = {
            moves_from: 'ABADCAFE',
            moves_to: 'DEADBEEF',
            ...sessionData,
          }
          req.journeyModel.get.returns('/')

          await controllerInstance.setInitialValues(req, res, next)
        })
        it('should set session values', async function () {
          expect(req.journeyModel.get).to.have.been.calledWith('lastVisited')
          expect(req.sessionModel.set).to.have.been.calledWith(sessionData)
        })

        it('should call next', async function () {
          expect(next).to.have.been.calledWith()
        })
      })

      context('on subsequent page visits', function () {
        beforeEach(async function () {
          req.journeyModel.get.returns('/details')

          await controllerInstance.setInitialValues(req, res, next)
        })

        it('should not set session values', function () {
          expect(req.sessionModel.set).not.to.have.been.called
        })

        it('should call next', function () {
          expect(next).to.have.been.calledWith()
        })
      })
    })

    describe('successHandler', function () {
      context('creating a new population', function () {
        beforeEach(function () {
          mockPopulationService.create = sinon.stub()
        })

        it('should call create on the population service', async function () {
          await controllerInstance.successHandler(req, res, next)

          expect(mockPopulationService.create).to.have.been.called
          expect(mockPopulationService.create).to.have.been.calledWith({
            location: req.locationId,
            date: req.date,
            updated_by: username,
            ...sessionData,
          })
        })

        it('should reset the journey model', async function () {
          await controllerInstance.successHandler(req, res, next)

          expect(req.journeyModel.reset).to.have.been.calledWith()
        })

        it('should reset the session model', async function () {
          await controllerInstance.successHandler(req, res, next)

          expect(req.sessionModel.reset).to.have.been.calledWith()
        })

        it('should redirect back to the population page', async function () {
          await controllerInstance.successHandler(req, res, next)

          expect(res.redirect).to.have.been.calledWith(
            `/population/day/${req.date}/${req.locationId}`
          )
        })

        it('should call next on failure', async function () {
          const error = new Error('Failure')
          mockPopulationService.create.rejects(error)

          await controllerInstance.successHandler(req, res, next)

          expect(req.journeyModel.reset).not.to.have.been.called
          expect(req.sessionModel.reset).not.to.have.been.called
          expect(next).to.have.been.calledWith(error)
        })
      })

      context('editing an existing population', function () {
        beforeEach(function () {
          req.population = {
            id: 'ABADCAFE',
          }

          mockPopulationService.update = sinon.stub()
        })

        it('should call update on the population service', async function () {
          await controllerInstance.successHandler(req, res, next)

          expect(mockPopulationService.update).to.have.been.calledWith({
            id: req.population.id,
            updated_by: username,
            ...sessionData,
          })
        })
        it('should reset the journey model', async function () {
          await controllerInstance.successHandler(req, res, next)

          expect(req.journeyModel.reset).to.have.been.calledWith()
        })
        it('should reset the session model', async function () {
          await controllerInstance.successHandler(req, res, next)

          expect(req.sessionModel.reset).to.have.been.calledWith()
        })
        it('should redirect back to the population page', async function () {
          await controllerInstance.successHandler(req, res, next)

          expect(res.redirect).to.have.been.calledWith(
            `/population/day/${req.date}/${req.locationId}`
          )
        })

        it('should call next on failure', async function () {
          const error = new Error('Failure')
          mockPopulationService.update.rejects(error)

          await controllerInstance.successHandler(req, res, next)

          expect(req.journeyModel.reset).not.to.have.been.called
          expect(req.sessionModel.reset).not.to.have.been.called
          expect(next).to.have.been.calledWith(error)
        })
      })
    })

    describe('setButtonText', function () {
      context('with an existing population', function () {
        beforeEach(function () {
          req.population = {}
          controllerInstance.setButtonText(req, res, next)
        })
        it('should use change text', function () {
          expect(req.form.options.buttonText).to.equal(
            'actions::change_numbers'
          )
        })

        it('should call next', function () {
          expect(next).to.have.been.calledWith()
        })
      })

      context('with an new population', function () {
        beforeEach(async function () {
          await controllerInstance.setButtonText(req, res, next)
        })
        it('should use add text', function () {
          expect(req.form.options.buttonText).to.equal('actions::add_numbers')
        })

        it('should call next', function () {
          expect(next).to.have.been.calledWith()
        })
      })
    })
  })
})
