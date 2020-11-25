const proxyquire = require('proxyquire')

const apiClient = {}
const ApiClient = sinon.stub().callsFake(req => apiClient)

const restClient = sinon.stub()

const populationService = proxyquire('./population', {
  '../lib/api-client/rest-client': restClient,
  '../lib/api-client': ApiClient,
})

const mockPopulations = [
  {
    id: '3b25c3e5-b16a-45af-b20a-ad1a4f9d3e61',
    operational_capacity: 219,
    usable_capacity: 260,
  },
]

describe('Population Service', function () {
  context('', function () {
    describe('#getById()', function () {
      context('without ID', function () {
        it('should reject with error', function () {
          return expect(populationService.getById()).to.be.rejectedWith(
            'No population ID supplied'
          )
        })
      })

      context('with population ID', function () {
        const mockId = 'b695d0f0-af8e-4b97-891e-92020d6820b9'
        const mockResponse = {
          data: mockPopulations[0],
        }
        let location

        beforeEach(async function () {
          apiClient.find = sinon.stub().resolves(mockResponse)

          location = await populationService.getById(mockId)
        })

        it('should call find method with data', function () {
          expect(apiClient.find).to.be.calledOnceWithExactly(
            'population',
            mockId,
            { include: undefined }
          )
        })

        it('should return location', function () {
          expect(location).to.deep.equal(mockResponse.data)
        })
      })

      context('with explicit include parameter', function () {
        const mockId = 'b695d0f0-af8e-4b97-891e-92020d6820b9'
        const mockResponse = {
          data: mockPopulations[0],
        }

        beforeEach(async function () {
          apiClient.find = sinon.stub().resolves(mockResponse)

          await populationService.getById(mockId, {
            include: ['foo', 'bar'],
          })
        })

        it('should pass include parameter to api client', function () {
          expect(apiClient.find).to.be.calledOnceWithExactly(
            'population',
            mockId,
            { include: ['foo', 'bar'] }
          )
        })
      })
    })
  })

  describe('#getByIdWithMoves()', function () {
    context('without ID', function () {
      beforeEach(function () {
        sinon.stub(populationService, 'getById')
      })

      afterEach(function () {
        populationService.getById.restore()
      })

      it('should pass through params to getById', function () {
        populationService.getByIdWithMoves('ABADCAFE')
        expect(populationService.getById).to.be.calledOnceWithExactly(
          'ABADCAFE',
          {
            include: ['moves_from', 'moves_to', 'location'],
          }
        )
      })
    })
  })
})
