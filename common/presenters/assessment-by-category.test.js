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
        expect(transformedResponse[0].category).to.equal('risk')
      })

      it('should correctly order categories', function() {
        expect(transformedResponse[1].category).to.equal('health')
      })

      it('should contain correct number of items', function() {
        expect(transformedResponse[0].items.length).to.equal(3)
        expect(transformedResponse[1].items.length).to.equal(3)
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
        expect(transformedResponse[0].category).to.equal('risk')
      })

      it('should correctly order categories', function() {
        expect(transformedResponse[1].category).to.equal('health')
      })

      it('should contain correct number of items', function() {
        expect(transformedResponse[0].items.length).to.equal(0)
        expect(transformedResponse[1].items.length).to.equal(0)
      })
    })
  })
})
