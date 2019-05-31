const personToSummaryListComponent = require('./person-to-summary-list-component')
const filters = require('../../config/nunjucks/filters')

const { data } = require('../../test/fixtures/api-client/moves.get.deserialized.json')

describe('Presenters', function () {
  describe('#personToSummaryListComponent()', function () {
    beforeEach(function () {
      sinon.stub(filters, 'formatDate').returns('18 Jun 1960')
      sinon.stub(filters, 'calculateAge').returns(50)
    })

    context('when provided with a mock move object', function () {
      let transformedResponse

      beforeEach(function () {
        transformedResponse = personToSummaryListComponent(data[0])
      })

      describe('response', function () {
        it('should contain rows', function () {
          expect(transformedResponse).to.have.property('rows')
        })
      })
    })
  })
})
