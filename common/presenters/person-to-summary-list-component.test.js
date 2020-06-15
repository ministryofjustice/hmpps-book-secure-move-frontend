const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')

const personToSummaryListComponent = require('./person-to-summary-list-component')

const mockPerson = {
  id: '12345',
  date_of_birth: '1948-04-24',
  gender_additional_information: 'Additional gender information',
  identifiers: [
    {
      identifier_type: 'police_national_computer',
      value: '11009922',
    },
    {
      identifier_type: 'prison_number',
      value: 'AA/183716',
    },
    {
      identifier_type: 'criminal_records_office',
      value: 'JS901873',
    },
  ],
  ethnicity: {
    title: 'Mixed (White and Black Caribbean)',
  },
  gender: {
    title: 'Transexual',
  },
}

describe('Presenters', function () {
  describe('#personToSummaryListComponent()', function () {
    beforeEach(function () {
      sinon.stub(i18n, 't').returns('__translated__')
      sinon.stub(filters, 'formatDate').returns('18 Jun 1960')
      sinon.stub(filters, 'calculateAge').returns(50)
    })

    context('when provided with a mock person object', function () {
      let transformedResponse

      beforeEach(function () {
        transformedResponse = personToSummaryListComponent(mockPerson)
      })

      describe('response', function () {
        it('should contain rows property', function () {
          expect(transformedResponse).to.have.property('rows')
          expect(transformedResponse.rows.length).to.equal(6)
        })

        it('should contain identifiers first', function () {
          const row1 = transformedResponse.rows[0]
          const row2 = transformedResponse.rows[1]
          const row3 = transformedResponse.rows[2]

          expect(row1).to.deep.equal({
            key: { html: '__translated__' },
            value: { text: mockPerson.identifiers[0].value },
          })
          expect(row2).to.deep.equal({
            key: { html: '__translated__' },
            value: { text: mockPerson.identifiers[1].value },
          })
          expect(row3).to.deep.equal({
            key: { html: '__translated__' },
            value: { text: mockPerson.identifiers[2].value },
          })
        })

        it('should contain date of birth', function () {
          const row = transformedResponse.rows[3]

          expect(row).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: '18 Jun 1960 (__translated__ 50)' },
          })
        })

        it('should contain gender', function () {
          const row = transformedResponse.rows[4]

          expect(row).to.deep.equal({
            key: { text: '__translated__' },
            value: {
              text: `${mockPerson.gender.title} — ${mockPerson.gender_additional_information}`,
            },
          })
        })

        it('should contain ethnicity', function () {
          const row = transformedResponse.rows[5]

          expect(row).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: mockPerson.ethnicity.title },
          })
        })
      })

      describe('translations', function () {
        it('should translate age label', function () {
          expect(i18n.t.firstCall).to.be.calledWithExactly('age')
        })

        it('should translate identifiers', function () {
          expect(i18n.t.getCall(1)).to.be.calledWithExactly(
            'fields::police_national_computer.label'
          )
          expect(i18n.t.getCall(2)).to.be.calledWithExactly(
            'fields::prison_number.label'
          )
          expect(i18n.t.getCall(3)).to.be.calledWithExactly(
            'fields::criminal_records_office.label'
          )
        })

        it('should translate date of birth label', function () {
          expect(i18n.t.getCall(4)).to.be.calledWithExactly(
            'fields::date_of_birth.label'
          )
        })

        it('should translate gender label', function () {
          expect(i18n.t.getCall(5)).to.be.calledWithExactly(
            'fields::gender.label'
          )
        })

        it('should translate ethnicity label', function () {
          expect(i18n.t.getCall(6)).to.be.calledWithExactly(
            'fields::ethnicity.label'
          )
        })

        it('should translate correct number of times', function () {
          expect(i18n.t).to.be.callCount(7)
        })
      })
    })

    context('when input values are not present', function () {
      let transformedResponse

      beforeEach(function () {
        transformedResponse = personToSummaryListComponent({
          id: '12345',
        })
      })

      describe('response', function () {
        it('should return an empty string for date of birth', function () {
          const row = transformedResponse.rows[0]

          expect(row).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: '' },
          })
        })

        it('should return an empty string for gender', function () {
          const row = transformedResponse.rows[1]

          expect(row).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: '' },
          })
        })

        it('should return an empty string for ethnicity', function () {
          const row = transformedResponse.rows[2]

          expect(row).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: '' },
          })
        })
      })
    })

    context('when no additional gender information', function () {
      let transformedResponse

      beforeEach(function () {
        transformedResponse = personToSummaryListComponent({
          id: '12345',
          gender: {
            title: 'Male',
          },
        })
      })

      describe('response', function () {
        it('should return only gender name', function () {
          const row = transformedResponse.rows[1]

          expect(row).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: 'Male' },
          })
        })
      })
    })

    context('when provided with no arguments', function () {
      let transformedResponse

      beforeEach(function () {
        transformedResponse = personToSummaryListComponent()
      })

      describe('response', function () {
        it('should return undefined', function () {
          expect(transformedResponse).to.be.undefined
        })
      })
    })
  })
})
