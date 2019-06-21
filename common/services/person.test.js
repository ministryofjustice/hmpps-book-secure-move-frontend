const personService = require('./person')
const { API } = require('../../config')
const auth = require('../lib/api-client/auth')

const personPostSerialized = require('../../test/fixtures/api-client/person.post.serialized.json')
const personPostDeserialized = require('../../test/fixtures/api-client/person.post.deserialized.json')

const genderMockId = 'd335715f-c9d1-415c-a7c8-06e830158214'
const ethnicityMockId = 'b95bfb7c-18cd-419d-8119-2dee1506726f'

describe('Person Service', function () {
  beforeEach(function () {
    sinon.stub(auth, 'getAccessToken').returns('test')
    sinon.stub(auth, 'getAccessTokenExpiry').returns(Math.floor(new Date() / 1000) + 100)
  })

  describe('#getFullname()', function () {
    it('should format full name', function () {
      const firstNames = 'Firstnames middlename'
      const lastName = 'Lastname'
      const fullname = personService.getFullname({
        first_names: firstNames,
        last_name: lastName,
      })

      expect(fullname).to.equal(`${lastName}, ${firstNames}`)
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

    context('when relationship field is not a string', function () {
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
  })

  describe('#create()', function () {
    context('when request returns 200', function () {
      let response

      beforeEach(async function () {
        nock(API.BASE_URL)
          .post('/people')
          .reply(200, personPostSerialized)

        response = await personService.create({
          first_names: 'Foo',
          last_names: 'Bar',
        })
      })

      it('should call API', function () {
        expect(nock.isDone()).to.be.true
      })

      it('should contain move with correct data', function () {
        expect(response).to.deep.equal(personPostDeserialized.data)
      })
    })
  })

  describe('#update()', function () {
    let mockId

    beforeEach(async function () {
      mockId = 'b695d0f0-af8e-4b97-891e-92020d6820b9'

      nock(API.BASE_URL)
        .patch(`/people/${mockId}`)
        .reply(200, personPostSerialized)
    })

    context('when no ID is supplied in the data object', function () {
      let response

      beforeEach(async function () {
        response = await personService.update({
          first_names: 'Foo',
          last_names: 'Bar',
        })
      })

      it('should not call API', function () {
        expect(nock.isDone()).to.be.false
      })

      it('should return', function () {
        expect(response).to.equal()
      })
    })

    context('when request returns 200', function () {
      let response

      beforeEach(async function () {
        response = await personService.update({
          id: mockId,
          first_names: 'Foo',
          last_names: 'Bar',
        })
      })

      it('should call API', function () {
        expect(nock.isDone()).to.be.true
      })

      it('should contain move with correct data', function () {
        expect(response).to.deep.equal(personPostDeserialized.data)
      })
    })
  })
})
