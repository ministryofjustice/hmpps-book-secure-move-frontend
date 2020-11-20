const youthRiskAssessmentService = require('../../../../common/services/youth-risk-assessment')

const { ConfirmYouthRiskAssessmentController } = require('./controllers')

const controller = new ConfirmYouthRiskAssessmentController({ route: '/' })

describe('Youth risk assessment controllers', function () {
  describe('ConfirmYouthRiskAssessmentController', function () {
    describe('#saveValues', function () {
      const mockPERId = 'c756d3fb-d5c0-4cf4-9416-6691a89570f2'
      let req, nextSpy

      beforeEach(function () {
        sinon.stub(youthRiskAssessmentService, 'confirm')
        nextSpy = sinon.spy()
        req = {
          assessment: {
            id: mockPERId,
          },
        }
      })

      context('when save is successful', function () {
        beforeEach(async function () {
          youthRiskAssessmentService.confirm.resolves({})
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
          youthRiskAssessmentService.confirm.throws(errorMock)
          await controller.saveValues(req, {}, nextSpy)
        })

        it('should call next with the error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly(errorMock)
        })
      })
    })
  })
})
