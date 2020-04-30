const filters = require('../../../config/nunjucks/filters')

const unformat = require('./person.unformat')

describe('Person Service', function() {
  describe('#unformat()', function() {
    let person
    let fields
    let keys
    let unformatted

    before(function() {
      person = {
        propertyField: 'propertyValue',
        relationshipField: {
          id: 'relationshipValue',
        },
        dateField: '2000-01-01',
        ignoredField: 'ignoredValue',
        identifiers: [
          {
            identifier_type: 'identifierField',
            value: 'identifierValue',
          },
          {
            identifier_type: 'ignoredField',
            value: 'ignoredValue',
          },
        ],
        assessment_answers: [
          {
            key: 'assessmentField',
            category: 'assessmentCategory',
            assessment_question_id: 'assessmentId',
            comments: 'assessmentValue',
          },
          {
            key: 'anotherAssessmentField',
            category: 'assessmentCategory',
            assessment_question_id: 'anotherAssessmentId',
            comments: 'anotherAssessmentValue',
          },
          {
            key: 'explicitAssessmentField',
            category: 'explicitAssessmentCategory',
            assessment_question_id: 'explicitAssessmentId',
            comments: 'explicitAssessmentValue',
          },
          {
            key: 'ignored',
            category: 'assessmentCategory',
            assessment_question_id: 'ignoredId',
            comments: 'ignoredValue',
          },
        ],
      }
    })

    beforeEach(function() {
      sinon.stub(filters, 'formatDate').returns('formattedDateValue')
      unformatted = unformat(person, fields, keys)
    })

    context('when asking for a property', function() {
      before(function() {
        fields = ['propertyField']
      })
      it('should return the value as is', function() {
        expect(unformatted).to.deep.equal({ propertyField: 'propertyValue' })
      })

      context('but it has no value', function() {
        before(function() {
          fields = ['missingPropertyField']
          keys = {
            date: ['missingPropertyField'],
          }
        })
        it('should return undefined', function() {
          expect(unformatted).to.deep.equal({
            missingPropertyField: undefined,
          })
        })
      })
    })

    context('when asking for an identifier', function() {
      before(function() {
        fields = ['identifierField']
        keys = {
          identifier: ['identifierField'],
        }
      })
      it('should return the identifier’s value', function() {
        expect(unformatted).to.deep.equal({
          identifierField: 'identifierValue',
        })
      })

      context('but it has no value', function() {
        before(function() {
          fields = ['missingIdentifierField']
          keys = {
            date: ['missingIdentifierField'],
          }
        })
        it('should return undefined', function() {
          expect(unformatted).to.deep.equal({
            missingIdentifierField: undefined,
          })
        })
      })
    })

    context('when asking for a relationship', function() {
      before(function() {
        fields = ['relationshipField']
        keys = {
          relationship: ['relationshipField'],
        }
      })
      it('should return the relationship’s id', function() {
        expect(unformatted).to.deep.equal({
          relationshipField: 'relationshipValue',
        })
      })

      context('but it has no value', function() {
        before(function() {
          fields = ['missingRelationshipField']
          keys = {
            date: ['missingRelationshipField'],
          }
        })
        it('should return undefined', function() {
          expect(unformatted).to.deep.equal({
            missingRelationshipField: undefined,
          })
        })
      })
    })

    context('when asking for a date', function() {
      before(function() {
        fields = ['dateField']
        keys = {
          date: ['dateField'],
        }
      })
      it('should call the date formatter correctly', function() {
        expect(filters.formatDate).to.be.calledOnceWithExactly('2000-01-01')
      })

      it('should return the value formatted as a date', function() {
        expect(unformatted).to.deep.equal({ dateField: 'formattedDateValue' })
      })

      context('but it has no value', function() {
        before(function() {
          fields = ['missingDateField']
          keys = {
            date: ['missingDateField'],
          }
        })
        it('should return undefined', function() {
          expect(unformatted).to.deep.equal({ missingDateField: undefined })
        })
      })
    })

    context('when asking for an assessment', function() {
      before(function() {
        fields = ['assessmentField']
        keys = {
          assessment: ['assessmentField'],
        }
      })
      it('should return the assessment comment and matched values for the assessment category', function() {
        expect(unformatted).to.deep.equal({
          assessmentField: 'assessmentValue',
          assessmentCategory: ['assessmentId'],
        })
      })

      context('but it has no value', function() {
        before(function() {
          fields = ['missingAssessmentField']
          keys = {
            assessment: ['missingAssessmentField'],
          }
        })
        it('should return undefined', function() {
          expect(unformatted).to.deep.equal({
            missingAssessmentField: undefined,
          })
        })
      })

      context('when asking for multiple', function() {
        before(function() {
          fields = ['assessmentField', 'anotherAssessmentField']
          keys = {
            assessment: ['assessmentField', 'anotherAssessmentField'],
          }
        })
        it('should return the assessment comments and matched values for the assessment category', function() {
          expect(unformatted).to.deep.equal({
            assessmentField: 'assessmentValue',
            anotherAssessmentField: 'anotherAssessmentValue',
            assessmentCategory: ['assessmentId', 'anotherAssessmentId'],
          })
        })
      })
    })

    context('when asking for an explicit assessment', function() {
      before(function() {
        fields = ['explicitAssessmentField']
        keys = {
          explicitAssessment: ['explicitAssessmentField'],
        }
      })
      it('should return the assessment comment and matched values for the assessment category', function() {
        expect(unformatted).to.deep.equal({
          explicitAssessmentField: 'explicitAssessmentValue',
          explicitAssessmentField__explicit: 'explicitAssessmentId',
        })
      })

      context('but it has no value', function() {
        before(function() {
          fields = ['missingExplicitAssessmentField']
          keys = {
            explicitAssessment: ['missingExplicitAssessmentField'],
          }
        })
        it('should return undefined and false for explicit value', function() {
          expect(unformatted).to.deep.equal({
            missingExplicitAssessmentField: undefined,
            missingExplicitAssessmentField__explicit: 'false',
          })
        })
      })
    })

    context('when asking for multiple fields of differing type', function() {
      before(function() {
        fields = [
          'propertyField',
          'identifierField',
          'relationshipField',
          'dateField',
          'assessmentField',
          'explicitAssessmentField',
        ]
        keys = {
          identifier: ['identifierField'],
          relationship: ['relationshipField'],
          date: ['dateField'],
          assessment: ['assessmentField'],
          explicitAssessment: ['explicitAssessmentField'],
        }
      })
      it('should return all the expected values', function() {
        expect(unformatted).to.deep.equal({
          propertyField: 'propertyValue',
          identifierField: 'identifierValue',
          relationshipField: 'relationshipValue',
          dateField: 'formattedDateValue',
          assessmentField: 'assessmentValue',
          explicitAssessmentField: 'explicitAssessmentValue',
          assessmentCategory: ['assessmentId'],
          explicitAssessmentField__explicit: 'explicitAssessmentId',
        })
      })
    })
  })
})
