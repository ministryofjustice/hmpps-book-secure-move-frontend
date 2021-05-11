const proxyquire = require('proxyquire')

const apiClient = require('../lib/api-client')()

const unformatStub = sinon.stub()

const PersonService = proxyquire('./person', {
  './person/person.unformat': unformatStub,
})
const personService = new PersonService({ apiClient })

const genderMockId = 'd335715f-c9d1-415c-a7c8-06e830158214'
const ethnicityMockId = 'b95bfb7c-18cd-419d-8119-2dee1506726f'
const mockId = 'b695d0f0-af8e-4b97-891e-92020d6820b9'
const mockPerson = {
  id: 'b695d0f0-af8e-4b97-891e-92020d6820b9',
  first_names: 'Steve Jones',
  last_name: 'Bloggs',
  category: {
    key: 'U',
  },
}

describe('Person Service', function () {
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
          criminal_records_office: 'CRO number',
          prison_number: 'Prison number',
        })
      })

      it('should format as relationship object', function () {
        expect(formatted.police_national_computer).to.equal('PNC number')
      })

      it('should format as relationship object', function () {
        expect(formatted.criminal_records_office).to.equal('CRO number')
      })

      it('should format as relationship object', function () {
        expect(formatted.prison_number).to.deep.equal('Prison number')
      })

      it('should not affect non relationship fields', function () {
        expect(formatted.first_names).to.equal('Foo')
      })

      it('should not include identifiers property', function () {
        expect(formatted.identifiers).to.be.undefined
      })
    })
  })

  describe('#unformat()', function () {
    const defaultKeys = {
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
          relationship: ['relationshipField'],
          date: ['dateField'],
        }
      })

      it('should call person.unformat with expected args', function () {
        expect(unformatStub).to.be.calledOnceWithExactly(person, fields, keys)
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
      sinon.stub(personService, 'format').returnsArg(0)

      person = await personService.create(mockData)
    })

    it('should call create method with data', function () {
      expect(apiClient.create).to.be.calledOnceWithExactly('person', mockData)
    })

    it('should format data', function () {
      expect(personService.format).to.be.calledOnceWithExactly(mockData)
    })

    it('should return data property', function () {
      expect(person).to.deep.equal(mockResponse.data)
    })
  })

  describe('#_getById()', function () {
    context('without person ID', function () {
      it('should reject with error', function () {
        return expect(personService._getById()).to.be.rejectedWith(
          'No person ID supplied'
        )
      })
    })

    context('with person ID', function () {
      const mockId = 'b695d0f0-af8e-4b97-891e-92020d6820b9'
      const mockResponse = {
        data: mockPerson,
      }
      let person

      beforeEach(async function () {
        sinon.stub(apiClient, 'find').resolves(mockResponse)
      })

      context('when called without include parameter', function () {
        beforeEach(async function () {
          person = await personService._getById(mockId)
        })
        it('should call find method with data', function () {
          expect(apiClient.find).to.be.calledOnceWithExactly(
            'person',
            mockId,
            {}
          )
        })

        it('should return person', function () {
          expect(person).to.deep.equal(mockResponse.data)
        })
      })

      context('when called with include parameter', function () {
        beforeEach(async function () {
          person = await personService._getById(mockId, {
            include: ['boo', 'far'],
          })
        })
        it('should pass include paramter to api client', function () {
          expect(apiClient.find).to.be.calledOnceWithExactly('person', mockId, {
            include: ['boo', 'far'],
          })
        })
      })
    })
  })

  describe('#getById()', function () {
    let person
    beforeEach(async function () {
      sinon.stub(personService, '_getById').resolves(mockPerson)
      person = await personService.getById(mockId)
    })
    it('should call find method with data', function () {
      expect(personService._getById).to.be.calledOnceWithExactly(mockId, {
        include: ['ethnicity', 'gender'],
      })
    })
    it('should return person', function () {
      expect(person).to.deep.equal(mockPerson)
    })
  })

  describe('#getCategory()', function () {
    let category
    beforeEach(async function () {
      sinon.stub(personService, '_getById').resolves(mockPerson)
      category = await personService.getCategory(mockId)
    })
    it('should call find method with data', function () {
      expect(personService._getById).to.be.calledOnceWithExactly(mockId, {
        include: ['category'],
      })
    })
    it('should return category', function () {
      expect(category).to.deep.equal(mockPerson.category)
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
      sinon.stub(personService, 'format').returnsArg(0)
    })

    context('without ID', function () {
      it('should reject with error', function () {
        return expect(personService.update()).to.be.rejectedWith(
          'No person ID supplied'
        )
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
          include: ['location'],
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
            'filter[date_from]': mockDate,
            'filter[date_to]': mockDate,
            include: ['location'],
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
            'filter[date_from]': undefined,
            'filter[date_to]': undefined,
            include: ['location'],
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
    })

    context('without filters', function () {
      beforeEach(async function () {
        person = await personService.getByIdentifiers()
      })

      it('should call findAll method with empty object', function () {
        expect(apiClient.findAll).to.be.calledOnceWithExactly('person', {
          include: ['gender'],
        })
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
          include: ['gender'],
        })
      })

      it('should return data property', function () {
        expect(person).to.deep.equal(mockResponse.data)
      })
    })
  })
})
