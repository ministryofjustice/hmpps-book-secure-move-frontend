const personToSummaryListComponent = require('./person-to-summary-list-component')
const filters = require('../../config/nunjucks/filters')

const {
  data: mockMove,
} = require('../../test/fixtures/api-client/move.get.deserialized.json')

describe('Presenters', function () {
  describe('#personToSummaryListComponent()', function () {
    beforeEach(function () {
      sinon.stub(filters, 'formatDate').returns('18 Jun 1960')
      sinon.stub(filters, 'calculateAge').returns(50)
    })

    context('when provided with a mock person object', function () {
      let transformedResponse

      beforeEach(function () {
        transformedResponse = personToSummaryListComponent(mockMove.person)
      })

      describe('response', function () {
        it('should contain rows property', function () {
          expect(transformedResponse).to.have.property('rows')
          expect(transformedResponse.rows.length).to.equal(4)
        })

        it('should contain PNC as first row', function () {
          const row = transformedResponse.rows[0]

          expect(row).to.deep.equal({
            key: { text: 'PNC Number' },
            value: { text: mockMove.person.identifiers[0].value },
          })
        })

        it('should contain date of birth as second row', function () {
          const row = transformedResponse.rows[1]

          expect(row).to.deep.equal({
            key: { text: 'Date of birth' },
            value: { text: '18 Jun 1960 (Age 50)' },
          })
        })

        it('should contain gender as third row', function () {
          const row = transformedResponse.rows[2]

          expect(row).to.deep.equal({
            key: { text: 'Gender' },
            value: { text: mockMove.person.gender.title },
          })
        })

        it('should contain ethnicity as fourth row', function () {
          const row = transformedResponse.rows[3]

          expect(row).to.deep.equal({
            key: { text: 'Ethnicity' },
            value: { text: mockMove.person.ethnicity.title },
          })
        })
      })
    })

    context('when input values are not present', function () {
      let transformedResponse

      beforeEach(function () {
        transformedResponse = personToSummaryListComponent({})
      })

      describe('response', function () {
        it('should return an empty string for police national computer', function () {
          const row = transformedResponse.rows[0]

          expect(row).to.deep.equal({
            key: { text: 'PNC Number' },
            value: { text: '' },
          })
        })

        it('should return an empty string for date of birth', function () {
          const row = transformedResponse.rows[1]

          expect(row).to.deep.equal({
            key: { text: 'Date of birth' },
            value: { text: '' },
          })
        })

        it('should return an empty string for gender', function () {
          const row = transformedResponse.rows[2]

          expect(row).to.deep.equal({
            key: { text: 'Gender' },
            value: { text: '' },
          })
        })

        it('should return an empty string for ethnicity', function () {
          const row = transformedResponse.rows[3]

          expect(row).to.deep.equal({
            key: { text: 'Ethnicity' },
            value: { text: '' },
          })
        })
      })
    })
  })
})
