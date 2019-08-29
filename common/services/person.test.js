const { forEach } = require('lodash')

const personService = require('./person')
const { API } = require('../../config')
const auth = require('../lib/api-client/middleware/auth')

const personPostSerialized = require('../../test/fixtures/api-client/person.post.serialized.json')
const personPostDeserialized = require('../../test/fixtures/api-client/person.post.deserialized.json')

const genderMockId = 'd335715f-c9d1-415c-a7c8-06e830158214'
const ethnicityMockId = 'b95bfb7c-18cd-419d-8119-2dee1506726f'

describe('Person Service', function() {
  beforeEach(function() {
    sinon.stub(auth, 'getAccessToken').returns('test')
    sinon
      .stub(auth, 'getAccessTokenExpiry')
      .returns(Math.floor(new Date() / 1000) + 100)
  })

  describe('#transform()', function() {
    let transformed

    context('with first name and last name', function() {
      beforeEach(async function() {
        transformed = await personService.transform(personPostDeserialized.data)
      })

      it('should set full name', function() {
        expect(transformed).to.contain.property('fullname')
        expect(transformed.fullname).to.equal(
          `${personPostDeserialized.data.last_name}, ${personPostDeserialized.data.first_names}`
        )
      })

      it('should contain original properties', function() {
        forEach(personPostDeserialized.data, (value, key) => {
          expect(transformed).to.contain.property(key)
          expect(transformed[key]).to.equal(value)
        })
      })
    })

    context('with no first name', function() {
      beforeEach(async function() {
        transformed = await personService.transform({
          last_name: 'Last',
        })
      })

      it('should return only last name for full name', function() {
        expect(transformed).to.contain.property('fullname')
        expect(transformed.fullname).to.equal('Last')
      })
    })

    context('with no last name', function() {
      beforeEach(async function() {
        transformed = await personService.transform({
          first_names: 'Firstname',
        })
      })

      it('should return only last name for full name', function() {
        expect(transformed).to.contain.property('fullname')
        expect(transformed.fullname).to.equal('Firstname')
      })
    })

    context('with no first name or last name', function() {
      beforeEach(async function() {
        transformed = await personService.transform()
      })

      it('should return only last name for full name', function() {
        expect(transformed).to.contain.property('fullname')
        expect(transformed.fullname).to.equal('')
      })
    })
  })

  describe('#format()', function() {
    context('when relationship field is string', function() {
      let formatted

      beforeEach(async function() {
        formatted = await personService.format({
          first_names: 'Foo',
          gender: genderMockId,
          ethnicity: ethnicityMockId,
        })
      })

      it('should format as relationship object', function() {
        expect(formatted.gender).to.deep.equal({
          id: genderMockId,
        })
      })

      it('should format as relationship object', function() {
        expect(formatted.ethnicity).to.deep.equal({
          id: ethnicityMockId,
        })
      })

      it('should not affect non relationship fields', function() {
        expect(formatted.first_names).to.equal('Foo')
      })
    })

    context('when relationship field is not a string', function() {
      let formatted

      beforeEach(async function() {
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

      it('should return its original value', function() {
        expect(formatted.gender).to.deep.equal({
          id: genderMockId,
        })
      })

      it('should return its original value', function() {
        expect(formatted.ethnicity).to.deep.equal({
          id: ethnicityMockId,
        })
      })

      it('should not affect non relationship fields', function() {
        expect(formatted.first_names).to.equal('Foo')
      })
    })

    context('when identifiers field is string', function() {
      let formatted

      beforeEach(async function() {
        formatted = await personService.format({
          first_names: 'Foo',
          police_national_computer: 'PNC number',
          athena_reference: 'Athena reference',
          criminal_records_office: 'CRO number',
          prison_number: 'Prison number',
          niche_reference: 'Niche reference',
        })
      })

      it('should format as relationship object', function() {
        expect(formatted.police_national_computer).to.deep.equal({
          value: 'PNC number',
          identifier_type: 'police_national_computer',
        })
      })

      it('should format as relationship object', function() {
        expect(formatted.athena_reference).to.deep.equal({
          value: 'Athena reference',
          identifier_type: 'athena_reference',
        })
      })

      it('should format as relationship object', function() {
        expect(formatted.criminal_records_office).to.deep.equal({
          value: 'CRO number',
          identifier_type: 'criminal_records_office',
        })
      })

      it('should format as relationship object', function() {
        expect(formatted.prison_number).to.deep.equal({
          value: 'Prison number',
          identifier_type: 'prison_number',
        })
      })

      it('should format as relationship object', function() {
        expect(formatted.niche_reference).to.deep.equal({
          value: 'Niche reference',
          identifier_type: 'niche_reference',
        })
      })

      it('should not affect non relationship fields', function() {
        expect(formatted.first_names).to.equal('Foo')
      })

      it('should include identifiers property', function() {
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

    context('when identifiers field is not a string', function() {
      let formatted

      beforeEach(async function() {
        formatted = await personService.format({
          first_names: 'Foo',
          police_national_computer: {
            value: 'PNC number',
            identifier_type: 'police_national_computer',
          },
        })
      })

      it('should return its original value', function() {
        expect(formatted.police_national_computer).to.deep.equal({
          value: 'PNC number',
          identifier_type: 'police_national_computer',
        })
      })

      it('should include identifiers property', function() {
        expect(formatted.identifiers).to.deep.equal([
          {
            identifier_type: 'police_national_computer',
            value: 'PNC number',
          },
        ])
      })

      it('should not affect non relationship fields', function() {
        expect(formatted.first_names).to.equal('Foo')
      })
    })

    context('when no identifiers present', function() {
      let formatted

      beforeEach(async function() {
        formatted = await personService.format({
          first_names: 'Foo',
        })
      })

      it('should include empty identifiers property', function() {
        expect(formatted.identifiers).to.deep.equal([])
      })

      it('should not affect non relationship fields', function() {
        expect(formatted.first_names).to.equal('Foo')
      })
    })

    context('when existing identifiers are present', function() {
      let formatted

      context('when new identifiers are present', function() {
        beforeEach(async function() {
          formatted = await personService.format({
            first_names: 'Foo',
            police_national_computer: '67890',
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

        it('should remove duplicates', function() {
          expect(formatted.identifiers.length).to.equal(2)
        })

        it('should return identifiers property', function() {
          expect(formatted.identifiers).to.deep.equal([
            {
              value: '67890',
              identifier_type: 'police_national_computer',
            },
            {
              value: 'Athena number',
              identifier_type: 'athena_reference',
            },
          ])
        })

        it('should not affect non relationship fields', function() {
          expect(formatted.first_names).to.equal('Foo')
        })
      })

      context('when no new identifiers are present', function() {
        beforeEach(async function() {
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

        it('should return identifiers property', function() {
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

        it('should not affect non relationship fields', function() {
          expect(formatted.first_names).to.equal('Foo')
        })
      })
    })
  })

  describe('#create()', function() {
    context('when request returns 200', function() {
      let response

      beforeEach(async function() {
        nock(API.BASE_URL)
          .post('/people')
          .reply(200, personPostSerialized)

        response = await personService.create({
          first_names: 'Foo',
          last_names: 'Bar',
        })
      })

      it('should call API', function() {
        expect(nock.isDone()).to.be.true
      })

      it('should contain move with correct data', function() {
        expect(response).to.deep.equal(personPostDeserialized.data)
      })
    })
  })

  describe('#update()', function() {
    let mockId

    beforeEach(async function() {
      mockId = 'b695d0f0-af8e-4b97-891e-92020d6820b9'

      nock(API.BASE_URL)
        .patch(`/people/${mockId}`)
        .reply(200, personPostSerialized)
    })

    context('when no ID is supplied in the data object', function() {
      let response

      beforeEach(async function() {
        response = await personService.update({
          first_names: 'Foo',
          last_names: 'Bar',
        })
      })

      it('should not call API', function() {
        expect(nock.isDone()).to.be.false
      })

      it('should return', function() {
        expect(response).to.equal()
      })
    })

    context('when request returns 200', function() {
      let response

      beforeEach(async function() {
        response = await personService.update({
          id: mockId,
          first_names: 'Foo',
          last_names: 'Bar',
        })
      })

      it('should call API', function() {
        expect(nock.isDone()).to.be.true
      })

      it('should contain move with correct data', function() {
        expect(response).to.deep.equal(personPostDeserialized.data)
      })
    })
  })
})
