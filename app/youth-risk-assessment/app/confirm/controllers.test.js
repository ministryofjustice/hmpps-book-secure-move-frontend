const { ConfirmYouthRiskAssessmentController } = require('./controllers')

const controller = new ConfirmYouthRiskAssessmentController({ route: '/' })

describe('Youth risk assessment controllers', function () {
  describe('ConfirmYouthRiskAssessmentController', function () {
    describe('#saveValues', function () {
      const mockPERId = 'c756d3fb-d5c0-4cf4-9416-6691a89570f2'
      let req, nextSpy, youthRiskAssessmentService

      beforeEach(function () {
        youthRiskAssessmentService = {
          confirm: sinon.stub().resolves({}),
        }
        nextSpy = sinon.spy()
        req = {
          assessment: {
            id: mockPERId,
          },
          services: {
            youthRiskAssessment: youthRiskAssessmentService,
          },
        }
      })

      context('when save is successful', function () {
        beforeEach(async function () {
          await controller.saveValues(req, {}, nextSpy)
        })

        it('should confirm person escort record', function () {
          expect(
            youthRiskAssessmentService.confirm
          ).to.be.calledOnceWithExactly(mockPERId)
        })

        it('should not throw an error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('when save fails', function () {
        const errorMock = new Error('Problem')

        beforeEach(async function () {
          req.services.youthRiskAssessment.confirm = sinon
            .stub()
            .throws(errorMock)
          await controller.saveValues(req, {}, nextSpy)
        })

        it('should call next with the error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly(errorMock)
        })
      })
    })
  })
})
