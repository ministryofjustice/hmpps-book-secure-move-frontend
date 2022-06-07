const i18n = require('../../config/i18n').default
const filters = require('../../config/nunjucks/filters')

const personToSummaryListComponent = require('./person-to-summary-list-component')

const mockPerson = {
  id: '12345',
  date_of_birth: '1948-04-24',
  gender_additional_information: 'Additional gender information',
  police_national_computer: '11009922',
  prison_number: 'AA/183716',
  criminal_records_office: 'JS901873',
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
      sinon.stub(i18n, 't').returnsArg(0)
      sinon.stub(filters, 'formatDate').returns('18 Jun 1960')
      sinon.stub(filters, 'calculateAge').returns(50)
    })

    context('when provided with a mock person object', function () {
      let transformedResponse

      beforeEach(function () {
        transformedResponse = personToSummaryListComponent(mockPerson)
      })

      describe('response', function () {
        it('should contain correct properties', function () {
          expect(Object.keys(transformedResponse)).to.deep.equal([
            'classes',
            'rows',
          ])
        })

        it('should set component classes', function () {
          expect(transformedResponse.classes).to.equal('govuk-!-font-size-16')
        })

        it('should contain correct number of rows', function () {
          expect(transformedResponse.rows.length).to.equal(7)
        })

        it('should contain identifiers first', function () {
          const row1 = transformedResponse.rows[0]
          const row2 = transformedResponse.rows[1]
          const row3 = transformedResponse.rows[2]
          expect(row1).to.deep.equal({
            key: { html: 'fields::police_national_computer.label' },
            value: { text: mockPerson.police_national_computer },
          })
          expect(row2).to.deep.equal({
            key: { html: 'fields::prison_number.label' },
            value: { text: mockPerson.prison_number },
          })
          expect(row3).to.deep.equal({
            key: { html: 'fields::criminal_records_office.label' },
            value: { text: mockPerson.criminal_records_office },
          })
        })

        it('should contain date of birth', function () {
          const row = transformedResponse.rows[3]
          expect(row).to.deep.equal({
            key: { text: 'fields::date_of_birth.label' },
            value: { text: '18 Jun 1960 (age 50)' },
          })
        })

        it('should contain gender', function () {
          const row = transformedResponse.rows[4]

          expect(row).to.deep.equal({
            key: { text: 'fields::gender.label' },
            value: {
              text: `${mockPerson.gender.title} — ${mockPerson.gender_additional_information}`,
            },
          })
        })

        it('should contain ethnicity', function () {
          const row = transformedResponse.rows[5]

          expect(row).to.deep.equal({
            key: { text: 'fields::ethnicity.label' },
            value: { text: mockPerson.ethnicity.title },
          })
        })

        it('should contain security category with fallback', function () {
          const row = transformedResponse.rows[6]

          expect(row).to.deep.equal({
            key: { text: 'fields::category.label' },
            value: {
              text: 'fields::category.uncategorised',
              classes: 'app-secondary-text-colour',
            },
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

        it('should translate category label', function () {
          expect(i18n.t.getCall(7)).to.be.calledWithExactly(
            'fields::category.label'
          )
        })

        it('should translate category uncategorised', function () {
          expect(i18n.t.getCall(8)).to.be.calledWithExactly(
            'fields::category.uncategorised'
          )
        })

        it('should translate correct number of times', function () {
          expect(i18n.t).to.be.callCount(9)
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
            key: { text: 'fields::date_of_birth.label' },
            value: { text: '' },
          })
        })

        it('should return an empty string for gender', function () {
          const row = transformedResponse.rows[1]

          expect(row).to.deep.equal({
            key: { text: 'fields::gender.label' },
            value: { text: '' },
          })
        })

        it('should return an empty string for ethnicity', function () {
          const row = transformedResponse.rows[2]

          expect(row).to.deep.equal({
            key: { text: 'fields::ethnicity.label' },
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
            key: { text: 'fields::gender.label' },
            value: { text: 'Male' },
          })
        })
      })
    })

    context('without prison number', function () {
      let transformedResponse

      beforeEach(function () {
        transformedResponse = personToSummaryListComponent({
          ...mockPerson,
          prison_number: undefined,
        })
      })

      it('should not contain security category', function () {
        const rows = transformedResponse.rows.map(row => row.key.text)

        expect(rows).not.to.include('fields::category.label')
      })
    })

    context('when person has category', function () {
      let transformedResponse
      let row

      describe('and has a prison number', function () {
        beforeEach(function () {
          transformedResponse = personToSummaryListComponent({
            ...mockPerson,
            category: {
              title: 'Category X',
            },
          })
          row = transformedResponse.rows.filter(
            row => row.key.text === 'fields::category.label'
          )[0]
        })

        it('should return the person’s category', function () {
          expect(row).to.deep.equal({
            key: { text: 'fields::category.label' },
            value: { text: 'Category X', classes: '' },
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
