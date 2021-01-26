const FormWizardController = require('../../../../common/controllers/form-wizard')

const Controller = require('./load-population')

describe('Population controllers', function () {
  describe('load population controller', function () {
    let req
    let res
    let next
    let controllerInstance

    beforeEach(function () {
      req = {
        sessionModel: {
          set: sinon.fake(),
          unset: sinon.fake(),
        },
        population: {
          operationalCapacity: 1000,
        },
        form: {},
      }
      res = {}

      next = sinon.fake()

      controllerInstance = new Controller({ route: '/' })
    })

    describe('saveValues', function () {
      beforeEach(function () {
        sinon.stub(FormWizardController.prototype, 'saveValues')

        controllerInstance.saveValues(req, res, next)
      })

      afterEach(function () {
        FormWizardController.prototype.saveValues.restore()
      })

      it('should set sessionModel with population', function () {
        expect(req.sessionModel.set).to.have.been.calledWithExactly(
          req.population
        )
      })

      it('should call super on success', async function () {
        await controllerInstance.saveValues(req, res, next)

        expect(
          FormWizardController.prototype.saveValues
        ).to.have.been.calledWith(req, res, next)
      })
    })
  })
})
