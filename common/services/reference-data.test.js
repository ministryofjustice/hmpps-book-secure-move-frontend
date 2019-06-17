const nock = require('nock')

const {
  getGenders,
  getEthnicities,
  getAssessmentQuestions,
} = require('./reference-data')
const { API } = require('../../config')

const gendersDeserialized = require('../../test/fixtures/api-client/reference.genders.deserialized.json')
const gendersSerialized = require('../../test/fixtures/api-client/reference.genders.serialized.json')
const ethnicitiesDeserialized = require('../../test/fixtures/api-client/reference.ethnicities.deserialized.json')
const ethnicitiesSerialized = require('../../test/fixtures/api-client/reference.ethnicities.serialized.json')
const assessmentDeserialized = require('../../test/fixtures/api-client/reference.assessment.deserialized.json')
const assessmentSerialized = require('../../test/fixtures/api-client/reference.assessment.serialized.json')

describe('Reference Service', function () {
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

      it('should return list of assessment questions', function () {
        expect(response.length).to.deep.equal(assessmentDeserialized.data.length)
        expect(response).to.deep.equal(assessmentDeserialized.data)
      })
    })
  })
})
