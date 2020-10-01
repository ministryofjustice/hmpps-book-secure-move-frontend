const proxyquire = require('proxyquire')

const apiClient = require('../lib/api-client')()
const profileService = require('../services/profile')

const mockFrameworksVersion = '2.5.3'
const personEscortRecordService = proxyquire('./person-escort-record', {
  '../../config': {
    FRAMEWORKS: {
      CURRENT_VERSION: mockFrameworksVersion,
    },
  },
})

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
      const mockMoveId = 'c756d3fb-d5c0-4cf4-9416-6691a89570f2'
      const mockResponse = {
        data: mockRecord,
      }
      let response

      beforeEach(async function () {
        sinon.stub(apiClient, 'create').resolves(mockResponse)

        response = await personEscortRecordService.create(mockMoveId)
      })

      it('should call create method with data and current framework version', function () {
        expect(apiClient.create).to.be.calledOnceWithExactly(
          'person_escort_record',
          {
            version: mockFrameworksVersion,
            move: {
              id: mockMoveId,
            },
          }
        )
      })

      it('should return record', function () {
        expect(response).to.deep.equal(mockResponse.data)
      })
    })

    describe('#confirm', function () {
      let output
      const mockId = '8567f1a5-2201-4bc2-b655-f6526401303a'

      beforeEach(async function () {
        sinon.stub(personEscortRecordService, 'transformResponse').returnsArg(0)
        sinon.stub(apiClient, 'update').resolves({
          data: mockRecord,
        })
      })

      context('without ID', function () {
        it('should reject with error', function () {
          return expect(personEscortRecordService.confirm()).to.be.rejectedWith(
            'No resource ID supplied'
          )
        })
      })

      context('with ID', function () {
        beforeEach(async function () {
          output = await personEscortRecordService.confirm(mockId)
        })

        it('calls the api service', function () {
          expect(apiClient.update).to.have.been.calledOnceWithExactly(
            'person_escort_record',
            {
              id: mockId,
              status: 'confirmed',
            }
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

    describe('#getById', function () {
      let output
      const mockId = '8567f1a5-2201-4bc2-b655-f6526401303a'

      beforeEach(async function () {
        sinon.stub(personEscortRecordService, 'transformResponse').returnsArg(0)
        sinon.stub(apiClient, 'find').resolves({
          data: mockRecord,
        })
      })

      context('without ID', function () {
        it('should reject with error', function () {
          return expect(personEscortRecordService.getById()).to.be.rejectedWith(
            'No resource ID supplied'
          )
        })
      })

      context('with ID', function () {
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

    describe('#respond', function () {
      let output
      const mockId = '8567f1a5-2201-4bc2-b655-f6526401303a'
      const mockResponses = [{ id: '1' }, { id: '2' }]

      beforeEach(async function () {
        sinon.stub(apiClient, 'patch').resolves({
          data: [],
        })
        sinon.spy(apiClient, 'all')
        sinon.spy(apiClient, 'one')
      })

      context('without ID', function () {
        it('should reject with error', function () {
          return expect(personEscortRecordService.respond()).to.be.rejectedWith(
            'No resource ID supplied'
          )
        })
      })

      context('no responses', function () {
        it('should return empty array', async function () {
          const response = await personEscortRecordService.respond(mockId, [])
          expect(response).to.deep.equal([])
        })
      })

      context('with ID', function () {
        beforeEach(async function () {
          output = await personEscortRecordService.respond(
            mockId,
            mockResponses
          )
        })

        it('calls the api service', function () {
          expect(apiClient.one).to.be.calledOnceWithExactly(
            'person_escort_record',
            mockId
          )
          expect(apiClient.all).to.be.calledOnceWithExactly(
            'framework_response'
          )
          expect(apiClient.patch).to.be.calledOnceWithExactly(mockResponses)
        })

        it('returns the output of transformer', function () {
          expect(output).to.deep.equal({
            data: [],
          })
        })
      })
    })
  })
})
