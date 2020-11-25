const proxyquire = require('proxyquire')

const apiClient = {}
const ApiClient = sinon.stub().callsFake(_req => apiClient)

const mockFrameworksVersion = '2.5.3'
const youthRiskAssessmentService = proxyquire('./youth-risk-assessment', {
  '../../config': {
    FRAMEWORKS: {
      CURRENT_VERSION: mockFrameworksVersion,
    },
  },
  '../lib/api-client': ApiClient,
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
  describe('Youth risk assessment service', function () {
    describe('#create()', function () {
      const mockMoveId = 'c756d3fb-d5c0-4cf4-9416-6691a89570f2'
      const mockResponse = {
        data: mockRecord,
      }
      let response

      beforeEach(async function () {
        apiClient.create = sinon.stub().resolves(mockResponse)

        response = await youthRiskAssessmentService.create(mockMoveId)
      })

      it('should call create method with data and current framework version', function () {
        expect(apiClient.create).to.be.calledOnceWithExactly(
          'youth_risk_assessment',
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
        apiClient.update = sinon.stub().resolves({
          data: mockRecord,
        })
      })

      context('without ID', function () {
        it('should reject with error', function () {
          return expect(
            youthRiskAssessmentService.confirm()
          ).to.be.rejectedWith('No resource ID supplied')
        })
      })

      context('with ID', function () {
        beforeEach(async function () {
          output = await youthRiskAssessmentService.confirm(mockId)
        })

        it('calls the api service', function () {
          expect(apiClient.update).to.have.been.calledOnceWithExactly(
            'youth_risk_assessment',
            {
              id: mockId,
              status: 'confirmed',
            }
          )
        })

        it('returns the data', function () {
          expect(output).to.deep.equal(mockRecord)
        })
      })
    })

    describe('#getById', function () {
      let output
      const mockId = '8567f1a5-2201-4bc2-b655-f6526401303a'

      beforeEach(async function () {
        apiClient.find = sinon.stub().resolves({
          data: mockRecord,
        })
      })

      context('without ID', function () {
        it('should reject with error', function () {
          return expect(
            youthRiskAssessmentService.getById()
          ).to.be.rejectedWith('No resource ID supplied')
        })
      })

      context('with ID', function () {
        beforeEach(async function () {
          output = await youthRiskAssessmentService.getById(mockId)
        })

        it('calls the api service', function () {
          expect(apiClient.find).to.have.been.calledOnceWithExactly(
            'youth_risk_assessment',
            mockId
          )
        })

        it('returns the data', function () {
          expect(output).to.deep.equal(mockRecord)
        })
      })
    })

    describe('#respond', function () {
      let output
      const mockId = '8567f1a5-2201-4bc2-b655-f6526401303a'
      const mockResponses = [{ id: '1' }, { id: '2' }]

      beforeEach(async function () {
        apiClient.patch = sinon.stub().resolves({
          data: [],
        })
        apiClient.all = sinon.stub().returns(apiClient)
        apiClient.one = sinon.stub().returns(apiClient)
      })

      context('without ID', function () {
        it('should reject with error', function () {
          return expect(
            youthRiskAssessmentService.respond()
          ).to.be.rejectedWith('No resource ID supplied')
        })
      })

      context('no responses', function () {
        it('should return empty array', async function () {
          const response = await youthRiskAssessmentService.respond(mockId, [])
          expect(response).to.deep.equal([])
        })
      })

      context('with ID', function () {
        beforeEach(async function () {
          output = await youthRiskAssessmentService.respond(
            mockId,
            mockResponses
          )
        })

        it('calls the api service', function () {
          expect(apiClient.one).to.be.calledOnceWithExactly(
            'youth_risk_assessment',
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
