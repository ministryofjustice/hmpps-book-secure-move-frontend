const fieldHelpers = require('../../../../../common/helpers/field')
const referenceDataHelpers = require('../../../../../common/helpers/reference-data')

const BaseController = require('./base')
const Controller = require('./prison-transfer-reason')

const controller = new Controller({ route: '/' })

describe('Move controllers', function () {
  describe('Prison transfer reason controller', function () {
    let mockReq, nextSpy, referenceDataService

    beforeEach(function () {
      nextSpy = sinon.spy()
    })

    describe('#middlewareSetup()', function () {
      beforeEach(function () {
        sinon.stub(BaseController.prototype, 'middlewareSetup')
        sinon.stub(controller, 'use')
        sinon.stub(controller, 'getPrisonTransferReason')
        sinon.stub(controller, 'setTransferReasonItems')

        controller.middlewareSetup()
      })

      it('should call parent method', function () {
        expect(BaseController.prototype.middlewareSetup).to.have.been.calledOnce
      })

      it('should call getPrisonTransferReason middleware', function () {
        expect(controller.use).to.have.been.calledWithExactly(
          controller.getPrisonTransferReason
        )
      })

      it('should call setTransferReasonItems middleware', function () {
        expect(controller.use).to.have.been.calledWithExactly(
          controller.setTransferReasonItems
        )
      })

      it('should call correct number of middleware', function () {
        expect(controller.use.callCount).to.equal(2)
      })
    })

    describe('#getPrisonTransferReason()', function () {
      const mockReasons = [
        {
          id: '12345',
        },
        {
          id: '67890',
        },
        {
          id: '09876',
        },
        {
          id: '54321',
        },
      ]

      beforeEach(function () {
        referenceDataService = {
          getPrisonTransferReasons: sinon.stub(),
        }
        mockReq = {
          services: {
            referenceData: referenceDataService,
          },
        }
      })

      context('when service rejects', function () {
        const mockError = new Error('Mock error')

        beforeEach(async function () {
          mockReq.services.referenceData.getPrisonTransferReasons = sinon
            .stub()
            .rejects(mockError)
          await controller.getPrisonTransferReason(mockReq, {}, nextSpy)
        })

        it('should call person service', function () {
          expect(
            referenceDataService.getPrisonTransferReasons
          ).to.be.calledOnceWithExactly()
        })

        it('should not set reasons', function () {
          expect(mockReq).not.to.contain.property('prisonTransferReasons')
        })

        it('should call next with error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly(mockError)
        })
      })

      context('when service resolves', function () {
        beforeEach(async function () {
          mockReq.services.referenceData.getPrisonTransferReasons = sinon
            .stub()
            .resolves(mockReasons)
          await controller.getPrisonTransferReason(mockReq, {}, nextSpy)
        })

        it('should call reference data service', function () {
          expect(
            referenceDataService.getPrisonTransferReasons
          ).to.be.calledOnceWithExactly()
        })

        it('should set reasons', function () {
          expect(mockReq).to.contain.property('prisonTransferReasons')
          expect(mockReq.prisonTransferReasons).to.deep.equal(mockReasons)
        })

        it('should call next', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })
    })

    describe('#setTransferReasonItems()', function () {
      beforeEach(function () {
        mockReq = {
          prisonTransferReasons: ['1', '2', '3'],
          form: {
            options: {
              fields: {
                prison_transfer_type: {},
              },
            },
          },
          models: {
            move: {
              move_type: 'prison_transfer',
            },
          },
        }

        sinon.stub(fieldHelpers, 'mapReferenceDataToOption').returnsArg(0)
        sinon
          .stub(referenceDataHelpers, 'filterDisabled')
          .callsFake(() => sinon.stub().returns(true))
        controller.setTransferReasonItems(mockReq, {}, nextSpy)
      })

      it('should call presenter', function () {
        expect(fieldHelpers.mapReferenceDataToOption.callCount).to.equal(
          mockReq.prisonTransferReasons.length
        )
      })

      it('should set items', function () {
        expect(
          mockReq.form.options.fields.prison_transfer_type.items
        ).to.deep.equal(mockReq.prisonTransferReasons)
      })

      it('should call next without error', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    describe('#process()', function () {
      const mockComments = 'Additional prison transfer comments'
      const mockTransferTypeId = '2'

      beforeEach(function () {
        mockReq = {
          prisonTransferReasons: [
            {
              id: '1',
              title: 'One',
            },
            {
              id: '2',
              title: 'Two',
            },
            {
              id: '3',
              title: 'Three',
            },
          ],
          form: {
            values: {
              prison_transfer_comments: mockComments,
              prison_transfer_type: mockTransferTypeId,
            },
          },
        }
        controller.process(mockReq, {}, nextSpy)
      })

      it('should set prison_transfer_reason', function () {
        expect(mockReq.form.values.prison_transfer_reason).to.deep.equal({
          id: '2',
          title: 'Two',
        })
      })

      it('should set additional_information', function () {
        expect(mockReq.form.values.additional_information).to.equal(
          mockComments
        )
      })

      it('should call next without error', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })
  })
})
