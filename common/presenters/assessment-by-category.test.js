const proxyquire = require('proxyquire')

const {
  data: mockPerson,
} = require('../../test/fixtures/api-client/person.create.json')
const assessmentByCategory = proxyquire('./assessment-by-category', {
  '../../config': {
    TAG_CATEGORY_WHITELIST: {
      health: {
        tagClass: '',
        sortOrder: 2,
      },
      risk: {
        tagClass: 'app-tag--destructive',
        sortOrder: 1,
      },
    },
  },
  '../../common/helpers/reference-data': {
    filterExpired: sinon.stub().returnsArg(0),
  },
})

describe('Presenters', function() {
  describe('#assessmentByCategory()', function() {
    context('when provided with mock moves response', function() {
      let transformedResponse

      beforeEach(function() {
        transformedResponse = assessmentByCategory(
          mockPerson.attributes.assessment_answers
        )
      })

      it('should return the correct number of categories', function() {
        expect(transformedResponse.length).to.equal(2)
      })

      it('should correctly order categories', function() {
        expect(transformedResponse[0].key).to.equal('risk')
      })

      it('should correctly order categories', function() {
        expect(transformedResponse[1].key).to.equal('health')
      })

      it('should contain correct number of types', function() {
        expect(
          Object.keys(transformedResponse[0].answersByTitle)
        ).to.have.length(3)
        expect(
          Object.keys(transformedResponse[1].answersByTitle)
        ).to.have.length(3)
      })

      it('should group risk answers correctly', function() {
        expect(transformedResponse[0].answersByTitle).to.deep.equal({
          Violent: [
            {
              title: 'Violent',
              comments: 'Karate black belt',
              date: null,
              expiry_date: null,
              assessment_question_id: '7448fb0c-d10e-4cab-9354-1732a4d17a30',
              category: 'risk',
              key: 'violent',
            },
          ],
          Escape: [
            {
              title: 'Escape',
              comments: 'Large poster in cell',
              date: null,
              expiry_date: null,
              assessment_question_id: 'd61c0068-cdb0-43de-88e5-c0a09adbf726',
              category: 'risk',
              key: 'escape',
            },
          ],
          'Must be held separately': [
            {
              title: 'Must be held separately',
              comments: 'Incitement to riot',
              date: null,
              expiry_date: null,
              assessment_question_id: '745a50e8-ea8d-4667-8ba0-c09c62ee3fc5',
              category: 'risk',
              key: 'hold_separately',
            },
          ],
        })
      })

      it('should group health answers correctly', function() {
        expect(transformedResponse[1].answersByTitle).to.deep.equal({
          'Special diet or allergy': [
            {
              title: 'Special diet or allergy',
              comments: 'Vegan',
              date: null,
              expiry_date: null,
              assessment_question_id: 'ff77c212-1244-4b2b-a441-81922d5c2ed8',
              category: 'health',
              key: 'special_diet_or_allergy',
            },
          ],
          'Health issue': [
            {
              title: 'Health issue',
              comments: 'Claustophobic',
              date: null,
              expiry_date: null,
              assessment_question_id: 'c1c8e0c1-4376-4f80-8515-dfb7d454a95c',
              category: 'health',
              key: 'health_issue',
            },
          ],
          Medication: [
            {
              title: 'Medication',
              comments: 'Heart medication needed twice daily',
              date: null,
              expiry_date: null,
              assessment_question_id: '044cca13-b632-4f65-8111-8902e4913cfe',
              category: 'health',
              key: 'medication',
            },
          ],
        })
      })
    })

    context('when no items exist for whitelisted category', function() {
      let transformedResponse

      beforeEach(function() {
        transformedResponse = assessmentByCategory([])
      })

      it('should return the correct number of categories', function() {
        expect(transformedResponse.length).to.equal(2)
      })

      it('should correctly order categories', function() {
        expect(transformedResponse[0].key).to.equal('risk')
      })

      it('should correctly order categories', function() {
        expect(transformedResponse[1].key).to.equal('health')
      })

      it('should contain correct number of types', function() {
        expect(
          Object.keys(transformedResponse[0].answersByTitle)
        ).to.have.length(0)
        expect(
          Object.keys(transformedResponse[1].answersByTitle)
        ).to.have.length(0)
      })
    })
  })
})
