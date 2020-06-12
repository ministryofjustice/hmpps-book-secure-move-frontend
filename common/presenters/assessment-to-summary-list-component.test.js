const {
  data: mockPerson,
} = require('../../test/fixtures/api-client/person.create.json')

const assessmentToSummaryListComponent = require('./assessment-to-summary-list-component')

describe('Presenters', function () {
  describe('#assessmentToSummaryListComponent()', function () {
    context('when provided with a mock person object', function () {
      let transformedResponse

      beforeEach(function () {
        transformedResponse = assessmentToSummaryListComponent(
          mockPerson.attributes.assessment_answers
        )
      })

      describe('response', function () {
        it('should contain rows property', function () {
          expect(transformedResponse).to.have.property('rows')
          expect(transformedResponse.rows.length).to.equal(8)
        })

        it('should format rows correctly', function () {
          expect(transformedResponse.rows).to.deep.equal([
            {
              key: { text: 'Violent' },
              value: { text: 'Karate black belt' },
            },
            {
              key: { text: 'Escape' },
              value: { text: 'Large poster in cell' },
            },
            {
              key: { text: 'Must be held separately' },
              value: { text: 'Incitement to riot' },
            },
            {
              key: { text: 'Special diet or allergy' },
              value: { text: 'Vegan' },
            },
            {
              key: { text: 'Health issue' },
              value: { text: 'Claustophobic' },
            },
            {
              key: { text: 'Medication' },
              value: { text: 'Heart medication needed twice daily' },
            },
            {
              key: { text: 'Solicitor or other legal representation' },
              value: { text: 'Johns & Sons' },
            },
            {
              key: { text: 'Any other information' },
              value: { text: 'Former prison officer' },
            },
          ])
        })
      })
    })

    context('when filter category is specific', function () {
      let transformedResponse

      beforeEach(function () {
        transformedResponse = assessmentToSummaryListComponent(
          mockPerson.attributes.assessment_answers,
          'court'
        )
      })

      describe('response', function () {
        describe('response', function () {
          it('should only return filtered categories', function () {
            expect(transformedResponse).to.have.property('rows')
            expect(transformedResponse.rows.length).to.equal(2)
          })

          it('should format filtered rows correctly', function () {
            expect(transformedResponse.rows).to.deep.equal([
              {
                key: { text: 'Solicitor or other legal representation' },
                value: { text: 'Johns & Sons' },
              },
              {
                key: { text: 'Any other information' },
                value: { text: 'Former prison officer' },
              },
            ])
          })
        })
      })
    })

    context('when called with empty arguments', function () {
      let transformedResponse

      beforeEach(function () {
        transformedResponse = assessmentToSummaryListComponent()
      })

      describe('response', function () {
        describe('response', function () {
          it('should return empty rows', function () {
            expect(transformedResponse).to.have.property('rows')
            expect(transformedResponse.rows.length).to.equal(0)
          })

          it('should return empty array', function () {
            expect(transformedResponse.rows).to.deep.equal([])
          })
        })
      })
    })
  })
})
