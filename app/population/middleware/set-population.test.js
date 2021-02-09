const middleware = require('./set-population')

const mockFreeSpaces = {
  'Category Epsilon': [
    {
      id: 'ABADCAFE',
      title: 'Lorem',
      meta: {
        populations: [
          { id: 'A', free_spaces: 0, transfers_in: 3, transfers_out: 2 },
        ],
      },
    },
  ],
}

const mockPopulation = {
  id: 'A',
  total_spaces: 100,
  moves_to: ['001', '002', '003'],
  moves_from: ['901', '902'],
}

const mockError = new Error('Error!!')

describe('Population middleware', function () {
  describe('#setPopulation()', function () {
    let res
    let req
    let next
    let populationService

    beforeEach(function () {
      populationService = {
        getByIdWithMoves: sinon.stub().resolves(mockPopulation),
      }

      next = sinon.fake()

      res = {}
      req = {
        body: {},
        dateRange: ['2020-08-01', '2020-08-01'],
        resultsAsPopulation: mockFreeSpaces,
        location: {
          id: 'BAADF00D',
        },
        params: {
          date: '2020-08-01',
        },
        services: {
          population: populationService,
        },
      }
    })

    context('default', function () {
      beforeEach(async function () {
        await middleware(req, res, next)
      })

      it('should call population service with population', function () {
        expect(populationService.getByIdWithMoves).to.have.been.calledOnceWith(
          'A'
        )
      })

      it('should set req.locationName', function () {
        expect(req.locationName).to.equal('Lorem')
      })

      it('should set req.population', function () {
        expect(req.population).to.deep.equal(mockPopulation)
      })

      it('should set req.transfers', function () {
        expect(req.transfers).to.deep.equal({
          transfersIn: 3,
          transfersOut: 2,
        })
      })

      it('should call next', function () {
        expect(next).to.have.been.calledOnceWithExactly()
      })
    })

    context('without population data', function () {
      beforeEach(async function () {
        const mockMissingFreeSpaces = {
          'Category Epsilon': [
            {
              id: 'ABADCAFE',
              meta: {
                populations: [{ transfers_in: 3, transfers_out: 2 }],
              },
            },
          ],
        }

        req.resultsAsPopulation = mockMissingFreeSpaces

        await middleware(req, res, next)
      })

      it('should not set req.population', function () {
        expect(req.population).to.be.undefined
      })

      it('should set req.transfers', function () {
        expect(req.transfers).to.deep.equal({
          transfersIn: 3,
          transfersOut: 2,
        })
      })
    })

    context('when population service rejects', function () {
      beforeEach(async function () {
        req.services.population.getByIdWithMoves = sinon
          .stub()
          .rejects(mockError)

        await middleware(req, res, next)
      })

      it('should set req properties', function () {
        expect(req).not.to.have.property('population')
      })

      it('should call next with error', function () {
        expect(next).to.have.been.calledOnceWithExactly(mockError)
      })
    })
  })
})
