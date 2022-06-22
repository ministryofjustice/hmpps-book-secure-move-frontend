const i18n = require('../../config/i18n').default

const personToMetaListComponent = require('./person-to-meta-list-component')

const mockPerson = {
  _fullname: 'DOE, JOHN',
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
  describe('#personToMetaListComponent()', function () {
    beforeEach(function () {
      sinon.stub(i18n, 't').returnsArg(0)
    })

    context('when provided with a mock person object', function () {
      let transformedResponse

      beforeEach(function () {
        transformedResponse = personToMetaListComponent(mockPerson)
      })

      describe('response', function () {
        it('should contain correct properties', function () {
          expect(transformedResponse).to.have.all.keys('classes', 'items')
        })

        it('should set component classes', function () {
          expect(transformedResponse.classes).to.equal('govuk-!-font-size-16')
        })

        it('should contain correct number of rows', function () {
          expect(transformedResponse.items.length).to.equal(3)
        })

        it('should order keys correctly', function () {
          const keys = transformedResponse.items.map(item => item.key)

          expect(keys).to.deep.equal([
            { text: 'name' },
            { html: 'fields::police_national_computer.label' },
            { html: 'fields::prison_number.label' },
          ])
        })

        it('should order values correctly', function () {
          const values = transformedResponse.items.map(item => item.value)

          expect(values).to.deep.equal([
            { text: mockPerson._fullname },
            { text: mockPerson.police_national_computer },
            { text: mockPerson.prison_number },
          ])
        })
      })

      describe('translations', function () {
        it('should call correct number of times', function () {
          expect(i18n.t.callCount).to.equal(3)
        })

        it('should call correct keys', function () {
          const translationKeys = i18n.t.args.map(arg => arg[0])

          expect(translationKeys).to.deep.equal([
            'fields::police_national_computer.label',
            'fields::prison_number.label',
            'name',
          ])
        })

        it('should call with correct args', function () {
          const translationArgs = i18n.t.args.map(arg => arg[1])

          expect(translationArgs).to.deep.equal([
            undefined,
            undefined,
            undefined,
          ])
        })
      })
    })

    context('when provided with no arguments', function () {
      let transformedResponse

      beforeEach(function () {
        transformedResponse = personToMetaListComponent()
      })

      describe('response', function () {
        it('should return undefined', function () {
          expect(transformedResponse).to.be.undefined
        })
      })
    })
  })
})
