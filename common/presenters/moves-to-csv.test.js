const fs = require('fs')
const path = require('path')
const json2csv = require('json2csv')

const movesToCSV = require('./moves-to-csv')
const referenceDataServce = require('../services/reference-data')
const i18n = require('../../config/i18n')

const {
  data: mockMoves,
} = require('../../test/fixtures/api-client/moves.get.deserialized.json')
const {
  data: mockQuestions,
} = require('../../test/fixtures/api-client/reference.assessment.deserialized.json')
const csv = fs.readFileSync(
  path.resolve(__dirname, '../../test/fixtures/moves.csv'),
  'utf8'
)
const emptyCsv = fs.readFileSync(
  path.resolve(__dirname, '../../test/fixtures/moves-empty.csv'),
  'utf8'
)

describe('Presenters', function() {
  describe('movesToCSV', function() {
    let transformedResponse

    beforeEach(function() {
      sinon.spy(json2csv, 'parse')
      sinon.stub(i18n, 't').returnsArg(0)
      sinon.stub(referenceDataServce, 'getAssessmentQuestions')
    })

    context('with mock move response', function() {
      beforeEach(async function() {
        referenceDataServce.getAssessmentQuestions.resolves(mockQuestions)

        transformedResponse = await movesToCSV(mockMoves)
      })

      it('should format correctly', function() {
        expect(transformedResponse).to.equal(csv.trim())
      })

      it('should call CSV parse', function() {
        expect(json2csv.parse).to.be.calledOnce
        expect(json2csv.parse.args[0][0]).to.deep.equal(mockMoves)
      })

      it('should call translations correct number of times', function() {
        expect(i18n.t).to.be.callCount(28)
      })
    })

    context('with no moves', function() {
      beforeEach(async function() {
        referenceDataServce.getAssessmentQuestions.resolves(mockQuestions)

        transformedResponse = await movesToCSV([])
      })

      it('should format correctly', function() {
        expect(transformedResponse).to.equal(emptyCsv.trim())
      })

      it('should call CSV parse', function() {
        expect(json2csv.parse).to.be.calledOnce
        expect(json2csv.parse.args[0][0]).to.deep.equal([])
      })
    })

    context('when reference data returns an error', function() {
      const errorStub = new Error('Error stub')

      beforeEach(function() {
        referenceDataServce.getAssessmentQuestions.rejects(errorStub)
      })

      it('should return error', function() {
        return expect(movesToCSV()).to.eventually.be.rejectedWith(errorStub)
      })
    })
  })
})
