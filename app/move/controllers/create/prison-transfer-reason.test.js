const fieldHelpers = require('../../../../common/helpers/field')
const referenceDataService = require('../../../../common/services/reference-data')

const FormController = require('hmpo-form-wizard').Controller

const PrisonTransferReasonsController = require('./prison-transfer-reason')
const prisonTransferReasonsController = new PrisonTransferReasonsController({
  route: '/prison_transfer_reason',
})

describe('Prison transfer reason controller', function() {
  let mockRequest

  context('happy path', function() {
    beforeEach(async function() {
      mockRequest = {
        form: {
          options: {
            fields: {
              prison_transfer_reason: {},
            },
          },
        },
      }
      sinon.stub(FormController.prototype, 'configure')
      sinon.stub(fieldHelpers, 'mapReferenceDataToOption').returns({})
      sinon
        .stub(referenceDataService, 'getPrisonTransferReasons')
        .resolves([{}, {}])
      await prisonTransferReasonsController.configure(mockRequest, {}, () => {})
    })
    it('calls reference data service', function() {
      expect(
        referenceDataService.getPrisonTransferReasons
      ).to.have.been.calledOnce
    })
    it('creates the correct options', function() {
      expect(fieldHelpers.mapReferenceDataToOption).to.have.been.calledTwice
    })
    it('sets the correct reason items', function() {
      expect(
        mockRequest.form.options.fields.prison_transfer_reason.items
      ).to.deep.equal([{}, {}])
    })
    it('invokes the parent configure', function() {
      expect(FormController.prototype.configure).to.have.been.calledOnce
    })
  })
  context('unhappy path', function() {
    let stubForNextHandler
    beforeEach(async function() {
      sinon
        .stub(referenceDataService, 'getPrisonTransferReasons')
        .rejects('referenceDataServiceError')
      stubForNextHandler = sinon.stub()
      await prisonTransferReasonsController.configure(
        {},
        {},
        stubForNextHandler
      )
    })
    it('invokes the next() handler', function() {
      expect(stubForNextHandler).to.have.been.calledWith(
        sinon.match.has('name', 'referenceDataServiceError')
      )
    })
  })
})
