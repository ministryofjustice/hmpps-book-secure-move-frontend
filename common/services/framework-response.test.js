const apiClient = require('../lib/api-client')()

const frameworkResponseService = require('./framework-response')

const mockFrameworkResponse = {
  id: '12345',
}

describe('Presenters', function () {
  describe('Framework Response Service', function () {
    describe('#update()', function () {
      const mockResponse = {
        data: mockFrameworkResponse,
      }
      let response

      context('without resource ID', function () {
        it('should reject with error', function () {
          return expect(frameworkResponseService.update()).to.be.rejectedWith(
            'No resource ID supplied'
          )
        })
      })

      context('with resource ID', function () {
        beforeEach(async function () {
          sinon.stub(apiClient, 'update').resolves(mockResponse)

          response = await frameworkResponseService.update(
            mockFrameworkResponse
          )
        })

        it('should call update method with data', function () {
          expect(apiClient.update).to.be.calledOnceWithExactly(
            'framework_response',
            mockFrameworkResponse
          )
        })

        it('should return move', function () {
          expect(response).to.deep.equal(mockResponse.data)
        })
      })
    })
  })
})
