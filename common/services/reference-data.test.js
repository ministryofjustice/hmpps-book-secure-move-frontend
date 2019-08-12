const {
  getGenders,
  getEthnicities,
  getAssessmentQuestions,
  getLocations,
  getLocationById,
  getLocationsById,
  getLocationByNomisAgencyId,
  getLocationsByNomisAgencyId,
} = require('./reference-data')
const { API } = require('../../config')
const auth = require('../lib/api-client/middleware/auth')

const gendersDeserialized = require('../../test/fixtures/api-client/reference.genders.deserialized.json')
const gendersSerialized = require('../../test/fixtures/api-client/reference.genders.serialized.json')
const ethnicitiesDeserialized = require('../../test/fixtures/api-client/reference.ethnicities.deserialized.json')
const ethnicitiesSerialized = require('../../test/fixtures/api-client/reference.ethnicities.serialized.json')
const assessmentDeserialized = require('../../test/fixtures/api-client/reference.assessment.deserialized.json')
const assessmentSerialized = require('../../test/fixtures/api-client/reference.assessment.serialized.json')
const locationsDeserialized = require('../../test/fixtures/api-client/reference.locations.deserialized.json')
const locationsPage1Serialized = require('../../test/fixtures/api-client/reference.locations.page-1.serialized.json')
const locationsPage2Serialized = require('../../test/fixtures/api-client/reference.locations.page-2.serialized.json')
const locationsSerialized = require('../../test/fixtures/api-client/reference.locations.serialized.json')
const locationDeserialized = require('../../test/fixtures/api-client/reference.location.deserialized.json')
const locationSerialized = require('../../test/fixtures/api-client/reference.location.serialized.json')

describe('Reference Service', function() {
  beforeEach(function() {
    sinon.stub(auth, 'getAccessToken').returns('test')
    sinon
      .stub(auth, 'getAccessTokenExpiry')
      .returns(Math.floor(new Date() / 1000) + 100)
  })

  describe('#getGenders()', function() {
    context('when request returns 200', function() {
      let response

      beforeEach(async function() {
        nock(API.BASE_URL)
          .get('/reference/genders')
          .reply(200, gendersSerialized)

        response = await getGenders()
      })

      it('should call API', function() {
        expect(nock.isDone()).to.be.true
      })

      it('should return list of genders', function() {
        expect(response.length).to.deep.equal(gendersDeserialized.data.length)
        expect(response).to.deep.equal(gendersDeserialized.data)
      })
    })
  })

  describe('#getEthnicities()', function() {
    context('when request returns 200', function() {
      let response

      beforeEach(async function() {
        nock(API.BASE_URL)
          .get('/reference/ethnicities')
          .reply(200, ethnicitiesSerialized)

        response = await getEthnicities()
      })

      it('should call API', function() {
        expect(nock.isDone()).to.be.true
      })

      it('should return list of ethnicities', function() {
        expect(response.length).to.deep.equal(
          ethnicitiesDeserialized.data.length
        )
        expect(response).to.deep.equal(ethnicitiesDeserialized.data)
      })
    })
  })

  describe('#getAssessmentQuestions()', function() {
    context('when request returns 200', function() {
      let response

      beforeEach(async function() {
        nock(API.BASE_URL)
          .get('/reference/assessment_questions')
          .reply(200, assessmentSerialized)

        response = await getAssessmentQuestions()
      })

      it('should call API', function() {
        expect(nock.isDone()).to.be.true
      })

      it('should return correct number of questions', function() {
        expect(response.length).to.deep.equal(
          assessmentDeserialized.data.length
        )
      })

      it('should deserialize assessment questions', function() {
        expect(response).to.deep.equal(assessmentDeserialized.data)
      })
    })
  })

  describe('#getLocations()', function() {
    context('with no parameters', function() {
      context('when request returns 200', function() {
        let response

        beforeEach(async function() {
          nock(API.BASE_URL)
            .get('/reference/locations')
            .query({ page: '1', per_page: '100' })
            .reply(200, locationsPage1Serialized)

          nock(API.BASE_URL)
            .get('/reference/locations')
            .query({ page: '2', per_page: '100' })
            .reply(200, locationsPage2Serialized)

          response = await getLocations()
        })

        it('should call API with no filter query parameters', function() {
          expect(nock.isDone()).to.be.true
        })

        it('should return a full list of locations', function() {
          expect(response.length).to.deep.equal(
            locationsDeserialized.data.length
          )
          expect(response).to.deep.equal(locationsDeserialized.data)
        })
      })
    })

    context('with type parameter', function() {
      context('when request returns 200', function() {
        let type

        beforeEach(async function() {
          type = 'police'

          nock(API.BASE_URL)
            .get('/reference/locations')
            .query({
              page: '1',
              per_page: '100',
              filter: { location_type: type },
            })
            .reply(200, locationsPage1Serialized)

          nock(API.BASE_URL)
            .get('/reference/locations')
            .query({
              page: '2',
              per_page: '100',
              filter: { location_type: type },
            })
            .reply(200, locationsPage2Serialized)

          await getLocations({ type: type })
        })

        it('should call API with the type filter query parameter', function() {
          expect(nock.isDone()).to.be.true
        })
      })
    })

    context('with nomisAgencyId parameter', function() {
      context('when request returns 200', function() {
        let nomisAgencyId

        beforeEach(async function() {
          nomisAgencyId = 'TEST'

          nock(API.BASE_URL)
            .get('/reference/locations')
            .query({
              page: '1',
              per_page: '100',
              filter: { nomis_agency_id: nomisAgencyId },
            })
            .reply(200, locationsPage1Serialized)

          nock(API.BASE_URL)
            .get('/reference/locations')
            .query({
              page: '2',
              per_page: '100',
              filter: { nomis_agency_id: nomisAgencyId },
            })
            .reply(200, locationsPage2Serialized)

          await getLocations({ nomisAgencyId: nomisAgencyId })
        })

        it('should call API with the nomis_agency_id filter query parameter', function() {
          expect(nock.isDone()).to.be.true
        })
      })
    })
  })

  describe('#getLocationById()', function() {
    context('when request returns 200', function() {
      let location

      beforeEach(async function() {
        nock(API.BASE_URL)
          .get(`/reference/locations/${locationDeserialized.data.id}`)
          .reply(200, locationSerialized)

        location = await getLocationById(locationDeserialized.data.id)
      })

      it('should get location from API', function() {
        expect(nock.isDone()).to.be.true
      })

      it('should contain location with correct data', function() {
        expect(location).to.deep.equal(locationDeserialized.data)
      })
    })
  })

  describe('#getLocationByNomisAgencyId()', function() {
    context('when request returns 200', function() {
      let nomisAgencyId, location

      beforeEach(async function() {
        nomisAgencyId = 'TEST'

        nock(API.BASE_URL)
          .get('/reference/locations')
          .query({
            page: '1',
            per_page: '100',
            filter: { nomis_agency_id: nomisAgencyId },
          })
          .reply(200, locationsSerialized)

        location = await getLocationByNomisAgencyId(nomisAgencyId)
      })

      it('should get location from API', function() {
        expect(nock.isDone()).to.be.true
      })

      it('should return only the first result', function() {
        expect(location).to.deep.equal(locationDeserialized.data)
      })
    })
  })

  describe('#getLocationsById()', function() {
    context('when request returns 200', function() {
      let locations

      beforeEach(async function() {
        nock(API.BASE_URL)
          .get(`/reference/locations/1`)
          .reply(200, locationSerialized)
        nock(API.BASE_URL)
          .get(`/reference/locations/2`)
          .reply(200, locationSerialized)
        nock(API.BASE_URL)
          .get(`/reference/locations/3`)
          .reply(200, locationSerialized)

        locations = await getLocationsById(['1', '2', '3'])
      })

      it('should get location from API', function() {
        expect(nock.isDone()).to.be.true
      })

      it('should contain location with correct data', function() {
        expect(locations).to.deep.equal([
          locationDeserialized.data,
          locationDeserialized.data,
          locationDeserialized.data,
        ])
      })
    })

    context('when locations are not found', function() {
      let locations

      beforeEach(async function() {
        nock(API.BASE_URL)
          .get(`/reference/locations/1`)
          .reply(200, locationSerialized)
        nock(API.BASE_URL)
          .get(`/reference/locations/2`)
          .reply(404, {})
        nock(API.BASE_URL)
          .get(`/reference/locations/3`)
          .reply(200, locationSerialized)
        nock(API.BASE_URL)
          .get(`/reference/locations/4`)
          .reply(404, {})

        locations = await getLocationsById(['1', '2', '3', '4'])
      })

      it('should get location from API', function() {
        expect(nock.isDone()).to.be.true
      })

      it('should filter out locations', function() {
        expect(locations).to.deep.equal([
          locationDeserialized.data,
          locationDeserialized.data,
        ])
      })
    })

    context('when called with empty locations', function() {
      let locations

      beforeEach(async function() {
        locations = await getLocationsById()
      })

      it('should return empty array', function() {
        expect(locations).to.deep.equal([])
      })
    })
  })

  describe('#getLocationsByNomisAgencyId()', function() {
    context('when request returns 200', function() {
      let locations

      beforeEach(async function() {
        nock(API.BASE_URL)
          .get('/reference/locations')
          .query({
            page: '1',
            per_page: '100',
            filter: { nomis_agency_id: 1 },
          })
          .reply(200, locationsSerialized)

        nock(API.BASE_URL)
          .get('/reference/locations')
          .query({
            page: '1',
            per_page: '100',
            filter: { nomis_agency_id: 2 },
          })
          .reply(200, locationsSerialized)

        nock(API.BASE_URL)
          .get('/reference/locations')
          .query({
            page: '1',
            per_page: '100',
            filter: { nomis_agency_id: 3 },
          })
          .reply(200, locationsSerialized)

        locations = await getLocationsByNomisAgencyId(['1', '2', '3'])
      })

      it('gets locations from the API', function() {
        expect(nock.isDone()).to.be.true
      })

      it('returns the first location result for each agency ID', function() {
        expect(locations).to.deep.equal([
          locationDeserialized.data,
          locationDeserialized.data,
          locationDeserialized.data,
        ])
      })
    })

    context('when locations are not found', function() {
      let locations

      beforeEach(async function() {
        nock(API.BASE_URL)
          .get('/reference/locations')
          .query({
            page: '1',
            per_page: '100',
            filter: { nomis_agency_id: 1 },
          })
          .reply(200, locationsSerialized)

        nock(API.BASE_URL)
          .get('/reference/locations')
          .query({
            page: '1',
            per_page: '100',
            filter: { nomis_agency_id: 2 },
          })
          .reply(404, {})

        nock(API.BASE_URL)
          .get('/reference/locations')
          .query({
            page: '1',
            per_page: '100',
            filter: { nomis_agency_id: 3 },
          })
          .reply(200, locationsSerialized)

        locations = await getLocationsByNomisAgencyId(['1', '2', '3'])
      })

      it('gets locations from the API', function() {
        expect(nock.isDone()).to.be.true
      })

      it('filters out locations not found', function() {
        expect(locations).to.deep.equal([
          locationDeserialized.data,
          locationDeserialized.data,
        ])
      })
    })

    context('when called with empty locations', function() {
      let locations

      beforeEach(async function() {
        locations = await getLocationsByNomisAgencyId()
      })

      it('returns an empty Array', function() {
        expect(locations).to.deep.equal([])
      })
    })
  })
})
