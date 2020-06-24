const filters = require('../../../config/nunjucks/filters')

const unformat = require('./person.unformat')

describe('Person Service', function () {
  describe('#unformat()', function () {
    let person
    let fields
    let keys
    let unformatted

    before(function () {
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
      }
    })

    beforeEach(function () {
      sinon.stub(filters, 'formatDate').returns('formattedDateValue')
      unformatted = unformat(person, fields, keys)
    })

    context('when asking for a property', function () {
      before(function () {
        fields = ['propertyField']
      })
      it('should return the value as is', function () {
        expect(unformatted).to.deep.equal({ propertyField: 'propertyValue' })
      })

      context('but it has no value', function () {
        before(function () {
          fields = ['missingPropertyField']
          keys = {
            date: ['missingPropertyField'],
          }
        })
        it('should return undefined', function () {
          expect(unformatted).to.deep.equal({
            missingPropertyField: undefined,
          })
        })
      })
    })

    context('when asking for an identifier', function () {
      before(function () {
        fields = ['identifierField']
        keys = {
          identifier: ['identifierField'],
        }
      })
      it('should return the identifier’s value', function () {
        expect(unformatted).to.deep.equal({
          identifierField: 'identifierValue',
        })
      })

      context('but it has no value', function () {
        before(function () {
          fields = ['missingIdentifierField']
          keys = {
            date: ['missingIdentifierField'],
          }
        })
        it('should return undefined', function () {
          expect(unformatted).to.deep.equal({
            missingIdentifierField: undefined,
          })
        })
      })
    })

    context('when asking for a relationship', function () {
      before(function () {
        fields = ['relationshipField']
        keys = {
          relationship: ['relationshipField'],
        }
      })
      it('should return the relationship’s id', function () {
        expect(unformatted).to.deep.equal({
          relationshipField: 'relationshipValue',
        })
      })

      context('but it has no value', function () {
        before(function () {
          fields = ['missingRelationshipField']
          keys = {
            date: ['missingRelationshipField'],
          }
        })
        it('should return undefined', function () {
          expect(unformatted).to.deep.equal({
            missingRelationshipField: undefined,
          })
        })
      })
    })

    context('when asking for a date', function () {
      before(function () {
        fields = ['dateField']
        keys = {
          date: ['dateField'],
        }
      })
      it('should call the date formatter correctly', function () {
        expect(filters.formatDate).to.be.calledOnceWithExactly('2000-01-01')
      })

      it('should return the value formatted as a date', function () {
        expect(unformatted).to.deep.equal({ dateField: 'formattedDateValue' })
      })

      context('but it has no value', function () {
        before(function () {
          fields = ['missingDateField']
          keys = {
            date: ['missingDateField'],
          }
        })
        it('should return undefined', function () {
          expect(unformatted).to.deep.equal({ missingDateField: undefined })
        })
      })
    })

    context('when asking for multiple fields of differing type', function () {
      before(function () {
        fields = [
          'propertyField',
          'identifierField',
          'relationshipField',
          'dateField',
        ]
        keys = {
          identifier: ['identifierField'],
          relationship: ['relationshipField'],
          date: ['dateField'],
        }
      })
      it('should return all the expected values', function () {
        expect(unformatted).to.deep.equal({
          propertyField: 'propertyValue',
          identifierField: 'identifierValue',
          relationshipField: 'relationshipValue',
          dateField: 'formattedDateValue',
        })
      })
    })
  })
})
