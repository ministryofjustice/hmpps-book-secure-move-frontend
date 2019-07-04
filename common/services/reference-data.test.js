const {
  getGenders,
  getEthnicities,
  getAssessmentQuestions,
  getLocations,
} = require('./reference-data')
const { API } = require('../../config')
const auth = require('../lib/api-client/auth')

const gendersDeserialized = require('../../test/fixtures/api-client/reference.genders.deserialized.json')
const gendersSerialized = require('../../test/fixtures/api-client/reference.genders.serialized.json')
const ethnicitiesDeserialized = require('../../test/fixtures/api-client/reference.ethnicities.deserialized.json')
const ethnicitiesSerialized = require('../../test/fixtures/api-client/reference.ethnicities.serialized.json')
const assessmentDeserialized = require('../../test/fixtures/api-client/reference.assessment.deserialized.json')
const assessmentSerialized = require('../../test/fixtures/api-client/reference.assessment.serialized.json')
const locationsDeserialized = require('../../test/fixtures/api-client/reference.locations.deserialized.json')
const locationsPage1Serialized = require('../../test/fixtures/api-client/reference.locations.page-1.serialized.json')
const locationsPage2Serialized = require('../../test/fixtures/api-client/reference.locations.page-2.serialized.json')

describe('Reference Service', function () {
  beforeEach(function () {
    sinon.stub(auth, 'getAccessToken').returns('test')
    sinon.stub(auth, 'getAccessTokenExpiry').returns(Math.floor(new Date() / 1000) + 100)
  })

  describe('#getGenders()', function () {
    context('when request returns 200', function () {
      let response

      beforeEach(async function () {
        nock(API.BASE_URL)
          .get('/reference/genders')
          .reply(200, gendersSerialized)

        response = await getGenders()
      })

      it('should call API', function () {
        expect(nock.isDone()).to.be.true
      })

      it('should return list of genders', function () {
        expect(response.length).to.deep.equal(gendersDeserialized.data.length)
        expect(response).to.deep.equal(gendersDeserialized.data)
      })
    })
  })

  describe('#getEthnicities()', function () {
    context('when request returns 200', function () {
      let response

      beforeEach(async function () {
        nock(API.BASE_URL)
          .get('/reference/ethnicities')
          .reply(200, ethnicitiesSerialized)

        response = await getEthnicities()
      })

      it('should call API', function () {
        expect(nock.isDone()).to.be.true
      })

      it('should return list of ethnicities', function () {
        expect(response.length).to.deep.equal(ethnicitiesDeserialized.data.length)
        expect(response).to.deep.equal(ethnicitiesDeserialized.data)
      })
    })
  })

  describe('#getAssessmentQuestions()', function () {
    context('when request returns 200', function () {
      let response

      beforeEach(async function () {
        nock(API.BASE_URL)
          .get('/reference/assessment_questions')
          .reply(200, assessmentSerialized)

        response = await getAssessmentQuestions()
      })

      it('should call API', function () {
        expect(nock.isDone()).to.be.true
      })

      it('should return correct number of questions', function () {
        expect(response.length).to.deep.equal(assessmentDeserialized.data.length)
      })

      it('should deserialize assessment questions', function () {
        expect(response).to.deep.equal(assessmentDeserialized.data)
      })
    })
  })

  describe('#getLocations()', function () {
    context('when request returns 200', function () {
      let response

      beforeEach(async function () {
        nock(API.BASE_URL)
          .get('/reference/locations')
          .query({ 'page': '1', 'per_page': '100' })
          .reply(200, locationsPage1Serialized)

        nock(API.BASE_URL)
          .get('/reference/locations')
          .query({ 'page': '2', 'per_page': '100' })
          .reply(200, locationsPage2Serialized)

        response = await getLocations()
      })

      it('should call API', function () {
        expect(nock.isDone()).to.be.true
      })

      it('should return a full list of locations', function () {
        expect(response.length).to.deep.equal(locationsDeserialized.data.length)
        expect(response).to.deep.equal(locationsDeserialized.data)
      })
    })
  })
})
