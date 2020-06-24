const { forEach } = require('lodash')
const proxyquire = require('proxyquire')

const apiClient = require('../lib/api-client')()

const unformatStub = sinon.stub()

const personService = proxyquire('./person', {
  './person/person.unformat': unformatStub,
})

const genderMockId = 'd335715f-c9d1-415c-a7c8-06e830158214'
const ethnicityMockId = 'b95bfb7c-18cd-419d-8119-2dee1506726f'
const mockPerson = {
  id: 'b695d0f0-af8e-4b97-891e-92020d6820b9',
  first_names: 'Steve Jones',
  last_name: 'Bloggs',
}

describe('Person Service', function () {
  describe('#transform()', function () {
    let transformed

    context('with first name and last name', function () {
      beforeEach(async function () {
        transformed = await personService.transform(mockPerson)
      })

      it('should set full name', function () {
        expect(transformed).to.contain.property('fullname')
        expect(transformed.fullname).to.equal(
          `${mockPerson.last_name}, ${mockPerson.first_names}`
        )
      })

      it('should set image url', function () {
        expect(transformed).to.contain.property('image_url')
        expect(transformed.image_url).to.equal(`/person/${mockPerson.id}/image`)
      })

      it('should contain original properties', function () {
        forEach(mockPerson, (value, key) => {
          expect(transformed).to.contain.property(key)
          expect(transformed[key]).to.equal(value)
        })
      })
    })

    context('with no first name', function () {
      beforeEach(async function () {
        transformed = await personService.transform({
          last_name: 'Last',
        })
      })

      it('should return only last name for full name', function () {
        expect(transformed).to.contain.property('fullname')
        expect(transformed.fullname).to.equal('Last')
      })
    })

    context('with no last name', function () {
      beforeEach(async function () {
        transformed = await personService.transform({
          first_names: 'Firstname',
        })
      })

      it('should return only last name for full name', function () {
        expect(transformed).to.contain.property('fullname')
        expect(transformed.fullname).to.equal('Firstname')
      })
    })

    context('with no first name or last name', function () {
      beforeEach(async function () {
        transformed = await personService.transform({})
      })

      it('should return only last name for full name', function () {
        expect(transformed).to.contain.property('fullname')
        expect(transformed.fullname).to.equal('')
      })
    })

    context('with no arguments', function () {
      beforeEach(async function () {
        transformed = await personService.transform()
      })

      it('should return only last name for full name', function () {
        expect(transformed).to.be.undefined
      })
    })

    context('with null', function () {
      beforeEach(async function () {
        transformed = await personService.transform(null)
      })

      it('should return only last name for full name', function () {
        expect(transformed).to.be.null
      })
    })
  })

  describe('#format()', function () {
    context('when relationship field is string', function () {
      let formatted

      beforeEach(async function () {
        formatted = await personService.format({
          first_names: 'Foo',
          gender: genderMockId,
          ethnicity: ethnicityMockId,
        })
      })

      it('should format as relationship object', function () {
        expect(formatted.gender).to.deep.equal({
          id: genderMockId,
        })
      })

      it('should format as relationship object', function () {
        expect(formatted.ethnicity).to.deep.equal({
          id: ethnicityMockId,
        })
      })

      it('should not affect non relationship fields', function () {
        expect(formatted.first_names).to.equal('Foo')
      })
    })

    context('when relationship field is an object', function () {
      let formatted

      beforeEach(async function () {
        formatted = await personService.format({
          first_names: 'Foo',
          gender: {
            id: genderMockId,
          },
          ethnicity: {
            id: ethnicityMockId,
          },
        })
      })

      it('should return its original value', function () {
        expect(formatted.gender).to.deep.equal({
          id: genderMockId,
        })
      })

      it('should return its original value', function () {
        expect(formatted.ethnicity).to.deep.equal({
          id: ethnicityMockId,
        })
      })

      it('should not affect non relationship fields', function () {
        expect(formatted.first_names).to.equal('Foo')
      })
    })

    context('when identifiers field is string', function () {
      let formatted

      beforeEach(async function () {
        formatted = await personService.format({
          first_names: 'Foo',
          police_national_computer: 'PNC number',
          athena_reference: 'Athena reference',
          criminal_records_office: 'CRO number',
          prison_number: 'Prison number',
          niche_reference: 'Niche reference',
        })
      })

      it('should format as relationship object', function () {
        expect(formatted.police_national_computer).to.deep.equal({
          value: 'PNC number',
          identifier_type: 'police_national_computer',
        })
      })

      it('should format as relationship object', function () {
        expect(formatted.athena_reference).to.deep.equal({
          value: 'Athena reference',
          identifier_type: 'athena_reference',
        })
      })

      it('should format as relationship object', function () {
        expect(formatted.criminal_records_office).to.deep.equal({
          value: 'CRO number',
          identifier_type: 'criminal_records_office',
        })
      })

      it('should format as relationship object', function () {
        expect(formatted.prison_number).to.deep.equal({
          value: 'Prison number',
          identifier_type: 'prison_number',
        })
      })

      it('should format as relationship object', function () {
        expect(formatted.niche_reference).to.deep.equal({
          value: 'Niche reference',
          identifier_type: 'niche_reference',
        })
      })

      it('should not affect non relationship fields', function () {
        expect(formatted.first_names).to.equal('Foo')
      })

      it('should include identifiers property', function () {
        expect(formatted.identifiers).to.deep.equal([
          {
            identifier_type: 'police_national_computer',
            value: 'PNC number',
          },
          {
            identifier_type: 'criminal_records_office',
            value: 'CRO number',
          },
          {
            identifier_type: 'prison_number',
            value: 'Prison number',
          },
          {
            identifier_type: 'niche_reference',
            value: 'Niche reference',
          },
          {
            identifier_type: 'athena_reference',
            value: 'Athena reference',
          },
        ])
      })
    })

    context('when identifiers field is not a string', function () {
      let formatted

      beforeEach(async function () {
        formatted = await personService.format({
          first_names: 'Foo',
          police_national_computer: {
            value: 'PNC number',
            identifier_type: 'police_national_computer',
          },
        })
      })

      it('should return its original value', function () {
        expect(formatted.police_national_computer).to.deep.equal({
          value: 'PNC number',
          identifier_type: 'police_national_computer',
        })
      })

      it('should include identifiers property', function () {
        expect(formatted.identifiers).to.deep.equal([
          {
            identifier_type: 'police_national_computer',
            value: 'PNC number',
          },
        ])
      })

      it('should not affect non relationship fields', function () {
        expect(formatted.first_names).to.equal('Foo')
      })
    })

    context('when no identifiers present', function () {
      let formatted

      beforeEach(async function () {
        formatted = await personService.format({
          first_names: 'Foo',
        })
      })

      it('should not include identifiers property', function () {
        expect(formatted).not.to.contain.property('identifiers')
      })

      it('should not affect non relationship fields', function () {
        expect(formatted.first_names).to.equal('Foo')
      })
    })

    context('when identifiers property exists', function () {
      let formatted

      context('when new identifiers are present', function () {
        context('with existing identifiers', function () {
          beforeEach(async function () {
            formatted = await personService.format({
              first_names: 'Foo',
              police_national_computer: '67890',
              niche_reference: 'ABCDE',
              identifiers: [
                {
                  value: '12345',
                  identifier_type: 'police_national_computer',
                },
                {
                  value: 'Athena number',
                  identifier_type: 'athena_reference',
                },
              ],
            })
          })

          it('should not create duplicates', function () {
            expect(formatted.identifiers.length).to.equal(3)
          })

          it('should merge identifiers correctly', function () {
            expect(formatted.identifiers).to.deep.equal([
              {
                value: '67890',
                identifier_type: 'police_national_computer',
              },
              {
                value: 'ABCDE',
                identifier_type: 'niche_reference',
              },
              {
                value: 'Athena number',
                identifier_type: 'athena_reference',
              },
            ])
          })

          it('should not affect non relationship fields', function () {
            expect(formatted.first_names).to.equal('Foo')
          })
        })

        context('with empty identifiers', function () {
          beforeEach(async function () {
            formatted = await personService.format({
              first_names: 'Foo',
              police_national_computer: '67890',
              niche_reference: 'ABCDE',
              identifiers: [],
            })
          })

          it('should not create duplicates', function () {
            expect(formatted.identifiers.length).to.equal(2)
          })

          it('should merge identifiers correctly', function () {
            expect(formatted.identifiers).to.deep.equal([
              {
                value: '67890',
                identifier_type: 'police_national_computer',
              },
              {
                value: 'ABCDE',
                identifier_type: 'niche_reference',
              },
            ])
          })

          it('should not affect non relationship fields', function () {
            expect(formatted.first_names).to.equal('Foo')
          })
        })
      })

      context('when no new identifiers are present', function () {
        context('with existing identifiers', function () {
          beforeEach(async function () {
            formatted = await personService.format({
              first_names: 'Foo',
              identifiers: [
                {
                  value: 'PNC number',
                  identifier_type: 'police_national_computer',
                },
                {
                  value: 'Athena number',
                  identifier_type: 'athena_reference',
                },
              ],
            })
          })

          it('should use original identifiers property', function () {
            expect(formatted.identifiers).to.deep.equal([
              {
                value: 'PNC number',
                identifier_type: 'police_national_computer',
              },
              {
                value: 'Athena number',
                identifier_type: 'athena_reference',
              },
            ])
          })

          it('should not affect non relationship fields', function () {
            expect(formatted.first_names).to.equal('Foo')
          })
        })

        context('with empty identifiers', function () {
          beforeEach(async function () {
            formatted = await personService.format({
              first_names: 'Foo',
              identifiers: [],
            })
          })

          it('should use original identifiers property', function () {
            expect(formatted.identifiers).to.deep.equal([])
          })

          it('should not affect non relationship fields', function () {
            expect(formatted.first_names).to.equal('Foo')
          })
        })
      })
    })

    context('with falsy values', function () {
      let formatted

      beforeEach(async function () {
        formatted = await personService.format({
          first_names: 'Foo',
          last_name: '',
          date_of_birth: undefined,
          gender: null,
          ethnicity: false,
        })
      })

      it('should remove null and undefined', function () {
        expect(formatted).to.deep.equal({
          first_names: 'Foo',
          last_name: '',
          ethnicity: false,
        })
      })
    })
  })

  describe('#unformat()', function () {
    const defaultKeys = {
      identifier: [
        'police_national_computer',
        'criminal_records_office',
        'prison_number',
        'niche_reference',
        'athena_reference',
      ],
      relationship: ['gender', 'ethnicity'],
      date: ['date_of_birth'],
    }
    const person = { id: '#personId' }
    const fields = ['foo']
    let keys

    beforeEach(function () {
      unformatStub.resetHistory()
      personService.unformat(person, fields, keys)
    })

    context('when called with no keys', function () {
      before(function () {
        keys = undefined
      })

      it('should call person.unformat with expected args', function () {
        expect(unformatStub).to.be.calledOnceWithExactly(
          person,
          fields,
          defaultKeys
        )
      })
    })

    context('when called with empty keys', function () {
      before(function () {
        keys = {}
      })

      it('should call person.unformat with expected args', function () {
        expect(unformatStub).to.be.calledOnceWithExactly(
          person,
          fields,
          defaultKeys
        )
      })
    })

    context('when called with keys', function () {
      before(function () {
        keys = {
          identifier: ['identifierField'],
          relationship: ['relationshipField'],
          date: ['dateField'],
        }
      })

      it('should call person.unformat with expected args', function () {
        expect(unformatStub).to.be.calledOnceWithExactly(person, fields, keys)
      })
    })

    context('when called with keys with some missing properties', function () {
      before(function () {
        keys = {
          identifier: ['identifierField'],
        }
      })

      it('should call person.unformat with expected args', function () {
        expect(unformatStub).to.be.calledOnceWithExactly(person, fields, {
          ...defaultKeys,
          ...keys,
        })
      })
    })
  })

  describe('#create()', function () {
    const mockData = {
      name: 'Steve Bloggs',
    }
    const mockResponse = {
      data: mockPerson,
    }
    let person

    beforeEach(async function () {
      sinon.stub(apiClient, 'create').resolves(mockResponse)
      sinon.stub(personService, 'transform').returnsArg(0)
      sinon.stub(personService, 'format').returnsArg(0)

      person = await personService.create(mockData)
    })

    it('should call create method with data', function () {
      expect(apiClient.create).to.be.calledOnceWithExactly('person', mockData)
    })

    it('should format data', function () {
      expect(personService.format).to.be.calledOnceWithExactly(mockData)
    })

    it('should transform response data', function () {
      expect(personService.transform).to.be.calledOnceWithExactly(
        mockResponse.data
      )
    })

    it('should return data property', function () {
      expect(person).to.deep.equal(mockResponse.data)
    })
  })

  describe('#update()', function () {
    const mockData = {
      id: 'b695d0f0-af8e-4b97-891e-92020d6820b9',
      name: 'Steve Bloggs',
    }
    const mockResponse = {
      data: mockPerson,
    }
    let person

    beforeEach(async function () {
      sinon.stub(apiClient, 'update').resolves(mockResponse)
      sinon.stub(personService, 'transform').returnsArg(0)
      sinon.stub(personService, 'format').returnsArg(0)
    })

    context('without ID', function () {
      beforeEach(async function () {
        person = await personService.update({})
      })

      it('should not call API', function () {
        expect(apiClient.update).not.to.be.called
      })

      it('should not format data', function () {
        expect(personService.format).not.to.be.called
      })
    })

    context('with ID', function () {
      beforeEach(async function () {
        person = await personService.update(mockData)
      })

      it('should call update method with data', function () {
        expect(apiClient.update).to.be.calledOnceWithExactly('person', mockData)
      })

      it('should format data', function () {
        expect(personService.format).to.be.calledOnceWithExactly(mockData)
      })

      it('should transform response data', function () {
        expect(personService.transform).to.be.calledOnceWithExactly(
          mockResponse.data
        )
      })

      it('should return data property', function () {
        expect(person).to.deep.equal(mockResponse.data)
      })
    })
  })

  describe('#getImageUrl()', function () {
    const mockId = 'b695d0f0-af8e-4b97-891e-92020d6820b9'
    const mockResponse = {
      data: {
        url: '/url-to-image',
      },
    }
    let imageUrl

    beforeEach(async function () {
      sinon.stub(apiClient, 'one').returnsThis()
      sinon.stub(apiClient, 'all').returnsThis()
      sinon.stub(apiClient, 'get').resolves(mockResponse)
    })

    context('without ID', function () {
      it('should reject with error', function () {
        return expect(personService.getImageUrl()).to.be.rejectedWith(
          'No ID supplied'
        )
      })
    })

    context('with ID', function () {
      beforeEach(async function () {
        imageUrl = await personService.getImageUrl(mockId)
      })

      it('should call correct api client methods', function () {
        expect(apiClient.one).to.be.calledOnceWithExactly('person', mockId)
        expect(apiClient.all).to.be.calledOnceWithExactly('image')
        expect(apiClient.get).to.be.calledOnceWithExactly()
      })

      it('should return image url property', function () {
        expect(imageUrl).to.deep.equal(mockResponse.data.url)
      })
    })
  })

  describe('#getActiveCourtCases()', function () {
    const mockId = 'b695d0f0-af8e-4b97-891e-92020d6820b9'
    const mockResponse = {
      data: [
        {
          id: 'T20167984',
        },
        {
          id: 'T20177984',
        },
      ],
    }
    let imageUrl

    beforeEach(async function () {
      sinon.stub(apiClient, 'one').returnsThis()
      sinon.stub(apiClient, 'all').returnsThis()
      sinon.stub(apiClient, 'get').resolves(mockResponse)
    })

    context('without ID', function () {
      it('should reject with error', function () {
        return expect(personService.getActiveCourtCases()).to.be.rejectedWith(
          'No ID supplied'
        )
      })
    })

    context('with ID', function () {
      beforeEach(async function () {
        imageUrl = await personService.getActiveCourtCases(mockId)
      })

      it('should call correct api client methods', function () {
        expect(apiClient.one).to.be.calledOnceWithExactly('person', mockId)
        expect(apiClient.all).to.be.calledOnceWithExactly('court_case')
        expect(apiClient.get).to.be.calledOnceWithExactly({
          'filter[active]': true,
        })
      })

      it('should return image url property', function () {
        expect(imageUrl).to.deep.equal(mockResponse.data)
      })
    })
  })

  describe('#getTimetableByDate()', function () {
    const mockId = 'b695d0f0-af8e-4b97-891e-92020d6820b9'
    const mockResponse = {
      data: [
        {
          id: '12345',
        },
        {
          id: '67890',
        },
      ],
    }
    let imageUrl

    beforeEach(async function () {
      sinon.stub(apiClient, 'one').returnsThis()
      sinon.stub(apiClient, 'all').returnsThis()
      sinon.stub(apiClient, 'get').resolves(mockResponse)
    })

    context('without ID', function () {
      it('should reject with error', function () {
        return expect(personService.getTimetableByDate()).to.be.rejectedWith(
          'No ID supplied'
        )
      })
    })

    context('with ID', function () {
      context('with date', function () {
        const mockDate = '2020-10-10'

        beforeEach(async function () {
          imageUrl = await personService.getTimetableByDate(mockId, mockDate)
        })

        it('should call correct api client methods', function () {
          expect(apiClient.one).to.be.calledOnceWithExactly('person', mockId)
          expect(apiClient.all).to.be.calledOnceWithExactly('timetable_entry')
          expect(apiClient.get).to.be.calledOnceWithExactly({
            filter: {
              date_from: mockDate,
              date_to: mockDate,
            },
          })
        })

        it('should return image url property', function () {
          expect(imageUrl).to.deep.equal(mockResponse.data)
        })
      })

      context('without date', function () {
        beforeEach(async function () {
          imageUrl = await personService.getTimetableByDate(mockId)
        })

        it('should call correct api client methods', function () {
          expect(apiClient.one).to.be.calledOnceWithExactly('person', mockId)
          expect(apiClient.all).to.be.calledOnceWithExactly('timetable_entry')
          expect(apiClient.get).to.be.calledOnceWithExactly({
            filter: {
              date_from: undefined,
              date_to: undefined,
            },
          })
        })

        it('should return image url property', function () {
          expect(imageUrl).to.deep.equal(mockResponse.data)
        })
      })
    })
  })

  describe('#getByIdentifiers()', function () {
    const mockResponse = {
      data: [mockPerson],
    }
    let person

    beforeEach(async function () {
      sinon.stub(apiClient, 'findAll').resolves(mockResponse)
      sinon.stub(personService, 'transform').returnsArg(0)
    })

    context('without filters', function () {
      beforeEach(async function () {
        person = await personService.getByIdentifiers()
      })

      it('should call findAll method with empty object', function () {
        expect(apiClient.findAll).to.be.calledOnceWithExactly('person', {
          include: undefined,
        })
      })

      it('should transform response data', function () {
        expect(personService.transform).to.be.calledOnceWithExactly(mockPerson)
      })

      it('should return data property', function () {
        expect(person).to.deep.equal(mockResponse.data)
      })
    })

    context('with filters', function () {
      beforeEach(async function () {
        person = await personService.getByIdentifiers({
          filterOne: 'filter-one-value',
          filterTwo: 'filter-two-value',
        })
      })

      it('should call findAll method with identifiers as filters', function () {
        expect(apiClient.findAll).to.be.calledOnceWithExactly('person', {
          'filter[filterOne]': 'filter-one-value',
          'filter[filterTwo]': 'filter-two-value',
          include: undefined,
        })
      })

      it('should transform response data', function () {
        expect(personService.transform).to.be.calledOnceWithExactly(mockPerson)
      })

      it('should return data property', function () {
        expect(person).to.deep.equal(mockResponse.data)
      })
    })

    context('with include parameter', function () {
      beforeEach(async function () {
        person = await personService.getByIdentifiers(
          {},
          { include: ['foo', 'bar'] }
        )
      })

      it('should pass include parameter to api client', function () {
        expect(apiClient.findAll).to.be.calledOnceWithExactly('person', {
          include: ['foo', 'bar'],
        })
      })
    })
  })
})
