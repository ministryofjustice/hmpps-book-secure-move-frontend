const personToSummaryListComponent = require('./person-to-summary-list-component')

const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')

const mockPerson = {
  date_of_birth: '1948-04-24',
  gender_additional_information: 'Additional gender information',
  identifiers: [
    {
      identifier_type: 'police_national_computer',
      value: '11009922',
    },
  ],
  ethnicity: {
    title: 'Mixed (White and Black Caribbean)',
  },
  gender: {
    title: 'Transexual',
  },
}

describe('Presenters', function() {
  describe('#personToSummaryListComponent()', function() {
    beforeEach(function() {
      sinon.stub(i18n, 't').returns('__translated__')
      sinon.stub(filters, 'formatDate').returns('18 Jun 1960')
      sinon.stub(filters, 'calculateAge').returns(50)
    })

    context('when provided with a mock person object', function() {
      let transformedResponse

      beforeEach(function() {
        transformedResponse = personToSummaryListComponent(mockPerson)
      })

      describe('response', function() {
        it('should contain rows property', function() {
          expect(transformedResponse).to.have.property('rows')
          expect(transformedResponse.rows.length).to.equal(4)
        })

        it('should contain PNC as first row', function() {
          const row = transformedResponse.rows[0]

          expect(row).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: mockPerson.identifiers[0].value },
          })
        })

        it('should contain date of birth as second row', function() {
          const row = transformedResponse.rows[1]

          expect(row).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: '18 Jun 1960 (__translated__ 50)' },
          })
        })

        it('should contain gender as third row', function() {
          const row = transformedResponse.rows[2]

          expect(row).to.deep.equal({
            key: { text: '__translated__' },
            value: {
              text: `${mockPerson.gender.title} — ${mockPerson.gender_additional_information}`,
            },
          })
        })

        it('should contain ethnicity as fourth row', function() {
          const row = transformedResponse.rows[3]

          expect(row).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: mockPerson.ethnicity.title },
          })
        })
      })

      describe('translations', function() {
        it('should translate age label', function() {
          expect(i18n.t.firstCall).to.be.calledWithExactly('age')
        })

        it('should translate PNC number label', function() {
          expect(i18n.t.secondCall).to.be.calledWithExactly(
            'fields::police_national_computer.label'
          )
        })

        it('should translate date of birth label', function() {
          expect(i18n.t.thirdCall).to.be.calledWithExactly(
            'fields::date_of_birth.label'
          )
        })

        it('should translate gender label', function() {
          expect(i18n.t.getCall(3)).to.be.calledWithExactly(
            'fields::gender.label'
          )
        })

        it('should translate ethnicity label', function() {
          expect(i18n.t.getCall(4)).to.be.calledWithExactly(
            'fields::ethnicity.label'
          )
        })

        it('should translate correct number of times', function() {
          expect(i18n.t).to.be.callCount(5)
        })
      })
    })

    context('when input values are not present', function() {
      let transformedResponse

      beforeEach(function() {
        transformedResponse = personToSummaryListComponent({})
      })

      describe('response', function() {
        it('should return an empty string for police national computer', function() {
          const row = transformedResponse.rows[0]

          expect(row).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: '' },
          })
        })

        it('should return an empty string for date of birth', function() {
          const row = transformedResponse.rows[1]

          expect(row).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: '' },
          })
        })

        it('should return an empty string for gender', function() {
          const row = transformedResponse.rows[2]

          expect(row).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: '' },
          })
        })

        it('should return an empty string for ethnicity', function() {
          const row = transformedResponse.rows[3]

          expect(row).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: '' },
          })
        })
      })
    })

    context('when no additional gender information', function() {
      let transformedResponse

      beforeEach(function() {
        transformedResponse = personToSummaryListComponent({
          gender: {
            title: 'Male',
          },
        })
      })

      describe('response', function() {
        it('should return only gender name', function() {
          const row = transformedResponse.rows[2]

          expect(row).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: 'Male' },
          })
        })
      })
    })
  })
})
