const fs = require('fs')
const path = require('path')

const json2csv = require('json2csv')

const i18n = require('../../config/i18n')
const mockMoves = require('../../test/fixtures/moves.json')
const referenceDataHelpers = require('../helpers/reference-data')
const referenceDataService = require('../services/reference-data')

const movesToCSV = require('./moves-to-csv')

const csv = fs.readFileSync(
  path.resolve(__dirname, '../../test/fixtures/moves.csv'),
  'utf8'
)
const emptyCsv = fs.readFileSync(
  path.resolve(__dirname, '../../test/fixtures/moves-empty.csv'),
  'utf8'
)

const mockQuestions = [
  {
    key: 'violent',
    title: 'Violent',
  },
  {
    key: 'escape',
    title: 'Escape',
  },
  {
    key: 'self_harm',
    title: 'Self harm',
  },
  {
    key: 'interpreter',
    title: 'Sign or other language interpreter',
  },
  {
    key: 'medication',
    title: 'Medication',
  },
  {
    key: 'health_issue',
    title: 'Health issue',
  },
]

describe('Presenters', function() {
  describe('movesToCSV', function() {
    let transformedResponse

    beforeEach(function() {
      sinon.spy(json2csv, 'parse')
      sinon.stub(i18n, 't').returnsArg(0)
      sinon.stub(referenceDataService, 'getAssessmentQuestions')
      sinon.stub(referenceDataHelpers, 'filterExpired').callsFake(item => {
        return true
      })
    })

    context('with mock move response', function() {
      beforeEach(async function() {
        referenceDataService.getAssessmentQuestions.resolves(mockQuestions)

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
        expect(i18n.t.callCount).to.equal(32)
      })

      it('should check alert is expired on each question', function() {
        expect(referenceDataHelpers.filterExpired.callCount).to.equal(318)
      })
    })

    context('with no moves', function() {
      beforeEach(async function() {
        referenceDataService.getAssessmentQuestions.resolves(mockQuestions)

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
        referenceDataService.getAssessmentQuestions.rejects(errorStub)
      })

      it('should return error', function() {
        return expect(movesToCSV()).to.eventually.be.rejectedWith(errorStub)
      })
    })
  })
})
