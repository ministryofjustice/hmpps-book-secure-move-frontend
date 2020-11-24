const controller = require('./print-record')

describe('Person Escort Record controllers', function () {
  // TODO: (PER) Expand tests to test rest of this controller
  describe('#printRecord', function () {
    let mockReq, mockRes, params

    beforeEach(function () {
      mockReq = {}
      mockRes = {
        render: sinon.stub(),
      }
      controller(mockReq, mockRes)
      params = mockRes.render.args[0][1]
    })

    it('should render a template', function () {
      expect(mockRes.render).to.have.been.calledOnce
      expect(mockRes.render.args[0][0]).to.equal(
        'person-escort-record/views/print-record'
      )
    })

    it('should contain correct locals', function () {
      expect(Object.keys(params)).to.have.length(18)
      expect(Object.keys(params)).to.deep.equal([
        'moveId',
        'moveType',
        'pickupLocation',
        'imageUrl',
        'fullname',
        'reference',
        'moveSummary',
        'courtSummary',
        'courtHearings',
        'isEscapeRisk',
        'hasSelfHarmWarning',
        'propertyToHandover',
        'propertyItemName',
        'sealNumberDescription',
        'requiresMedicationDuringTransport',
        'personalDetailsSummary',
        'personEscortRecordSections',
        'personEscortRecordTagList',
      ])
    })
  })
})
