const proxyquire = require('proxyquire')

const apiClient = require('../lib/api-client')()

const mockFrameworksVersion = '2.5.3'
const YouthRiskAssessmentService = proxyquire('./youth-risk-assessment', {
  '../../config': {
    FRAMEWORKS: {
      CURRENT_VERSION: mockFrameworksVersion,
    },
  },
})
const youthRiskAssessmentService = new YouthRiskAssessmentService({ apiClient })

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
        sinon.stub(apiClient, 'create').resolves(mockResponse)

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

      beforeEach(function () {
        sinon.stub(apiClient, 'update').resolves({
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

      beforeEach(function () {
        sinon.stub(apiClient, 'find').resolves({
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
            mockId,
            {
              include: [
                'profile',
                'profile.person',
                'framework',
                'responses',
                'responses.question',
                'responses.question.descendants.**',
                'responses.nomis_mappings',
                'flags',
                'prefill_source',
                'move',
              ],
            }
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

      beforeEach(function () {
        sinon.stub(apiClient, 'patch').resolves({
          data: [],
        })
        sinon.spy(apiClient, 'all')
        sinon.spy(apiClient, 'one')
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
