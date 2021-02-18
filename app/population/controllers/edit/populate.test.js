const mockPopulationService = {
  populate: sinon.stub(),
}

const FormWizardController = require('../../../../common/controllers/form-wizard')

const Controller = require('./populate')

describe('Population controllers', function () {
  describe('populate controller', function () {
    let req
    let res
    let next
    let controllerInstance

    beforeEach(function () {
      req = {
        date: '2020-06-01',
        location: { id: 'DEADBEEF' },
        session: {
          user: {
            fullname: 'Lorem Ipsum',
          },
        },
        sessionModel: {
          set: sinon.fake(),
        },
        form: {
          options: {
            fullPath: '/details',
          },
        },
        services: {
          population: mockPopulationService,
        },
      }
      res = {}

      next = sinon.fake()

      controllerInstance = new Controller({ route: '/' })
    })

    describe('#saveValues', function () {
      beforeEach(function () {
        sinon.stub(FormWizardController.prototype, 'saveValues')
      })

      afterEach(function () {
        FormWizardController.prototype.saveValues.restore()
      })

      it('should call populate on the population service', async function () {
        await controllerInstance.saveValues(req, res, next)

        expect(mockPopulationService.populate).to.have.been.calledWith({
          location: req.location.id,
          date: req.date,
        })
      })

      it('should set the session model with populated values', async function () {
        const populateData = {
          operationalCapacity: 1000,
        }
        mockPopulationService.populate.resolves(populateData)

        await controllerInstance.saveValues(req, res, next)

        expect(req.sessionModel.set).to.have.been.calledWith(populateData)
      })

      it('should call super on success', async function () {
        await controllerInstance.saveValues(req, res, next)

        expect(
          FormWizardController.prototype.saveValues
        ).to.have.been.calledWith(req, res, next)
      })

      it('should call next on failure', async function () {
        const error = new Error('Failure')
        req.services.population.populate = sinon.stub().rejects(error)

        await controllerInstance.saveValues(req, res, next)

        expect(req.sessionModel.set).not.to.have.been.called
        expect(next).to.have.been.calledWith(error)
      })
    })
  })
})
