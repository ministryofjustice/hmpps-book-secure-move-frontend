const apiClient = require('../lib/api-client')()
const profileService = require('../services/profile')

const personEscortRecordService = require('./person-escort-record')

const mockRecord = {
  id: '12345',
  status: 'not_started',
  responses: [
    {
      value: 'Yes',
      value_type: 'string',
    },
    {
      value: 'No',
      value_type: 'string',
    },
  ],
}

describe('Services', function () {
  describe('Person Escort Record Service', function () {
    describe('#transformResponse()', function () {
      const mockProfile = {
        id: '__profile__',
        person: {},
      }
      let response

      beforeEach(function () {
        sinon.stub(profileService, 'transform').returnsArg(0)

        response = personEscortRecordService.transformResponse({
          data: {
            id: '__id__',
            profile: mockProfile,
          },
        })
      })

      it('should transform the profile', function () {
        expect(profileService.transform).to.be.calledOnceWithExactly(
          mockProfile
        )
      })

      it('should add the person object as a direct property', function () {
        expect(response.profile).to.deep.equal(mockProfile)
      })

      it('should return transformed data', function () {
        expect(response).to.deep.equal({
          id: '__id__',
          profile: mockProfile,
        })
      })
    })

    describe('#create()', function () {
      const mockProfileId = 'c756d3fb-d5c0-4cf4-9416-6691a89570f2'
      const mockResponse = {
        data: mockRecord,
      }
      let response

      beforeEach(async function () {
        sinon.stub(apiClient, 'create').resolves(mockResponse)

        response = await personEscortRecordService.create(mockProfileId)
      })

      it('should call create method with data', function () {
        expect(apiClient.create).to.be.calledOnceWithExactly(
          'person_escort_record',
          {
            profile: {
              id: mockProfileId,
            },
          }
        )
      })

      it('should return record', function () {
        expect(response).to.deep.equal(mockResponse.data)
      })
    })

    describe('#getById', function () {
      let output
      const mockId = '8567f1a5-2201-4bc2-b655-f6526401303a'

      beforeEach(async function () {
        sinon.stub(personEscortRecordService, 'transformResponse').returnsArg(0)
        sinon.stub(apiClient, 'find').resolves({
          data: mockRecord,
        })
      })

      context('without move ID', function () {
        it('should reject with error', function () {
          return expect(personEscortRecordService.getById()).to.be.rejectedWith(
            'No resource ID supplied'
          )
        })
      })

      context('with move ID', function () {
        beforeEach(async function () {
          output = await personEscortRecordService.getById(mockId)
        })

        it('calls the api service', function () {
          expect(apiClient.find).to.have.been.calledOnceWithExactly(
            'person_escort_record',
            mockId
          )
        })

        it('should call move transformer with response data', function () {
          expect(
            personEscortRecordService.transformResponse
          ).to.be.calledOnceWithExactly({
            data: mockRecord,
          })
        })

        it('returns the output of transformer', function () {
          expect(output).to.deep.equal({
            data: mockRecord,
          })
        })
      })
    })
  })
})
