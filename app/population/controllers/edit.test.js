const proxyquire = require('proxyquire')
const mockPopulationService = {}

const Controller = proxyquire('./edit', {
  '../../../common/services/population': mockPopulationService,
})

describe('Population controllers', function () {
  describe('#edit()', function () {
    describe('setInitialValues', function () {})

    describe('successHandler', function () {
      let req
      let res
      let next
      let controllerInstance
      let sessionModel
      let username

      beforeEach(function () {
        username = 'user.fullname'
        sessionModel = { key: 'value' }
        req = {
          date: '2020-06-01',
          locationId: 'DEADBEEF',
          sessionModel: {
            toJSON: sinon.stub().returns(sessionModel),
            reset: sinon.fake(),
          },
          journeyModel: {
            reset: sinon.fake(),
          },
        }
        res = {
          redirect: sinon.fake(),
        }

        next = sinon.fake()

        controllerInstance = new Controller({ route: '/' })
      })
      context('creating a new population', function () {
        beforeEach(function () {
          mockPopulationService.create = sinon.stub()
        })

        it('should call create on the population service', async function () {
          await controllerInstance.successHandler(req, res, next)

          expect(mockPopulationService.create).to.have.been.calledWith(
            req.locationId,
            req.date,
            {
              updated_by: username,
              ...sessionModel,
            }
          )
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
            ...sessionModel,
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
  })
})
