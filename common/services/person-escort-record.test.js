const apiClient = require('../lib/api-client')()

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
  describe('Person Escort Record', function () {
    describe('#getById', function () {
      let output
      const mockId = '8567f1a5-2201-4bc2-b655-f6526401303a'

      beforeEach(async function () {
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

        it('returns the data from the api service', function () {
          expect(output).to.deep.equal(mockRecord)
        })
      })
    })
  })
})
