const proxyquire = require('proxyquire')

const apiClient = require('../lib/api-client')()

const restClient = sinon.stub()

const LocationsFreeSpacesService = proxyquire('./locations-free-spaces', {
  '../lib/api-client/rest-client': restClient,
})
const locationsFreeSpacesService = new LocationsFreeSpacesService({ apiClient })

const mockLocations = [
  {
    id: '2c952ca0-f750-4ac3-ac76-fb631445f974',
    title: 'Axminster Crown Court',
    category: {
      title: 'Category Epsilon',
    },
  },
  {
    id: '9b56ca31-222b-4522-9d65-4ef429f9081e',
    title: 'Barnstaple Crown Court',
  },
]

const mockGroupedLocations = {
  'Category Epsilon': [
    {
      id: '2c952ca0-f750-4ac3-ac76-fb631445f974',
      title: 'Axminster Crown Court',
      category: {
        title: 'Category Epsilon',
      },
    },
  ],
  'No Category': [
    {
      id: '9b56ca31-222b-4522-9d65-4ef429f9081e',
      title: 'Barnstaple Crown Court',
    },
  ],
}

const dateFrom = '2020-06-01'
const dateTo = '2020-06-07'

let locationsFreeSpaces

describe('Locations Free Spaces Service', function () {
  describe('#getLocationsFreeSpaces()', function () {
    const mockResponse = {
      data: mockLocations,
      links: {},
    }
    const mockMultiPageResponse = {
      data: mockLocations,
      links: {
        next: 'http://next-page.com',
      },
    }
    const mockEmptyPageResponse = {
      data: [],
      links: {
        next: 'http://next-page.com',
      },
    }
    const mockFilter = {
      location_id: 'ABADBEEF',
      'sort[by]': 'name',
      'sort[direction]': 'asc',
    }

    beforeEach(function () {
      sinon.stub(apiClient, 'findAll')
    })

    context('with only one page', function () {
      beforeEach(function () {
        apiClient.findAll.resolves(mockResponse)
      })

      context('by default', function () {
        beforeEach(async function () {
          locationsFreeSpaces =
            await locationsFreeSpacesService.getLocationsFreeSpaces({
              dateFrom,
              dateTo,
            })
        })

        it('should call the API client once', function () {
          expect(apiClient.findAll).to.be.calledOnce
        })

        it('should call the API client with default options', function () {
          expect(apiClient.findAll.firstCall).to.be.calledWithExactly(
            'locations_free_spaces',
            {
              date_from: dateFrom,
              date_to: dateTo,
              page: 1,
              per_page: 100,
              include: undefined,
            }
          )
        })
      })

      context('with filter', function () {
        beforeEach(async function () {
          locationsFreeSpaces =
            await locationsFreeSpacesService.getLocationsFreeSpaces({
              dateFrom,
              dateTo,
              filter: mockFilter,
            })
        })

        it('should call the API client with filter', function () {
          expect(apiClient.findAll.firstCall).to.be.calledWithExactly(
            'locations_free_spaces',
            {
              ...mockFilter,
              date_from: dateFrom,
              date_to: dateTo,
              page: 1,
              per_page: 100,
              include: undefined,
            }
          )
        })
      })
    })

    context('with multiple pages', function () {
      beforeEach(function () {
        apiClient.findAll
          .onFirstCall()
          .resolves(mockMultiPageResponse)
          .onSecondCall()
          .resolves(mockResponse)
      })

      context('by default', function () {
        beforeEach(async function () {
          locationsFreeSpaces =
            await locationsFreeSpacesService.getLocationsFreeSpaces({
              dateFrom,
              dateTo,
            })
        })

        it('should call the API client twice', function () {
          expect(apiClient.findAll).to.be.calledTwice
        })

        it('should call API client with default options on first call', function () {
          expect(apiClient.findAll.firstCall).to.be.calledWithExactly(
            'locations_free_spaces',
            {
              date_from: dateFrom,
              date_to: dateTo,
              page: 1,
              per_page: 100,
              include: undefined,
            }
          )
        })

        it('should call API client with second page on second call', function () {
          expect(apiClient.findAll.secondCall).to.be.calledWithExactly(
            'locations_free_spaces',
            {
              date_from: dateFrom,
              date_to: dateTo,
              page: 2,
              per_page: 100,
              include: undefined,
            }
          )
        })
      })

      context('with filter', function () {
        beforeEach(async function () {
          locationsFreeSpaces =
            await locationsFreeSpacesService.getLocationsFreeSpaces({
              dateFrom,
              dateTo,
              filter: mockFilter,
            })
        })

        it('should call API client with filter on first call', function () {
          expect(apiClient.findAll.firstCall).to.be.calledWithExactly(
            'locations_free_spaces',
            {
              date_from: dateFrom,
              date_to: dateTo,
              ...mockFilter,
              page: 1,
              per_page: 100,
              include: undefined,
            }
          )
        })

        it('should call API client with filter on second call', function () {
          expect(apiClient.findAll.secondCall).to.be.calledWithExactly(
            'locations_free_spaces',
            {
              ...mockFilter,
              date_from: dateFrom,
              date_to: dateTo,
              page: 2,
              per_page: 100,
              include: undefined,
            }
          )
        })
      })
    })

    context('with next but no data', function () {
      beforeEach(async function () {
        apiClient.findAll.resolves(mockEmptyPageResponse)
        locationsFreeSpaces =
          await locationsFreeSpacesService.getLocationsFreeSpaces({
            dateFrom,
            dateTo,
          })
      })

      it('should call the API client once', function () {
        expect(apiClient.findAll).to.be.calledOnce
      })

      it('should return no moves', function () {
        expect(locationsFreeSpaces).to.deep.equal([])
      })
    })

    context('when called with include parameter', function () {
      beforeEach(async function () {
        apiClient.findAll.resetHistory()
        apiClient.findAll.resolves(mockResponse)
        await locationsFreeSpacesService.getLocationsFreeSpaces({
          dateFrom,
          dateTo,
          include: ['foo', 'bar'],
        })
      })
      it('should pass include paramter to api client', function () {
        expect(apiClient.findAll).to.be.calledOnceWithExactly(
          'locations_free_spaces',
          {
            date_from: dateFrom,
            date_to: dateTo,
            page: 1,
            per_page: 100,
            include: ['foo', 'bar'],
          }
        )
      })
    })
  })

  describe('#getPrisonFreeSpaces()', function () {
    let mockResponse
    beforeEach(function () {
      mockResponse = mockLocations
    })
    context('by default', function () {
      beforeEach(async function () {
        sinon
          .stub(locationsFreeSpacesService, 'getLocationsFreeSpaces')
          .resolves(mockResponse)

        locationsFreeSpaces =
          await locationsFreeSpacesService.getPrisonFreeSpaces({
            dateFrom,
            dateTo,
          })
      })

      afterEach(function () {
        locationsFreeSpacesService.getLocationsFreeSpaces.restore()
      })

      it('should call getLocationsFreeSpaces methods', function () {
        expect(
          locationsFreeSpacesService.getLocationsFreeSpaces
        ).to.be.calledOnce
      })

      it('should return first result', function () {
        expect(locationsFreeSpaces).to.deep.equal(mockGroupedLocations)
      })

      it('should call use provided date params', function () {
        expect(
          locationsFreeSpacesService.getLocationsFreeSpaces
        ).to.be.calledWith({
          dateFrom,
          dateTo,
          filter: {
            'filter[location_type]': 'prison',
          },
          include: ['category'],
        })
      })

      it('should set location_type filter to prison', function () {
        const filters =
          locationsFreeSpacesService.getLocationsFreeSpaces.args[0][0].filter

        expect(filters).to.contain.property('filter[location_type]')
        expect(filters['filter[location_type]']).to.equal('prison')
      })
    })

    context('with locationIds', function () {
      beforeEach(async function () {
        sinon
          .stub(locationsFreeSpacesService, 'getLocationsFreeSpaces')
          .resolves(mockResponse)

        locationsFreeSpaces =
          await locationsFreeSpacesService.getPrisonFreeSpaces({
            dateFrom,
            dateTo,
            locationIds: 'ABADFEED',
          })
      })

      afterEach(function () {
        locationsFreeSpacesService.getLocationsFreeSpaces.restore()
      })

      it('should call getLocationsFreeSpaces methods', function () {
        expect(
          locationsFreeSpacesService.getLocationsFreeSpaces
        ).to.be.calledOnce
      })

      it('should return first result', function () {
        expect(locationsFreeSpaces).to.deep.equal(mockGroupedLocations)
      })

      it('should set location_type filter to prison', function () {
        const filters =
          locationsFreeSpacesService.getLocationsFreeSpaces.args[0][0].filter

        expect(filters).to.contain.property('filter[location_type]')
        expect(filters['filter[location_type]']).to.equal('prison')
      })

      it('should call use provided date params', function () {
        expect(
          locationsFreeSpacesService.getLocationsFreeSpaces
        ).to.be.calledWith({
          dateFrom,
          dateTo,
          filter: {
            'filter[location_id]': 'ABADFEED',
            'filter[location_type]': 'prison',
          },
          include: ['category'],
        })
      })

      it('should set location_type filter to prison', function () {
        const filters =
          locationsFreeSpacesService.getLocationsFreeSpaces.args[0][0].filter

        expect(filters).to.contain.property('filter[location_type]')
        expect(filters['filter[location_type]']).to.equal('prison')
      })

      it('should set locationIds filter to locationIds', function () {
        const filters =
          locationsFreeSpacesService.getLocationsFreeSpaces.args[0][0].filter

        expect(filters).to.contain.property('filter[location_id]')
        expect(filters['filter[location_id]']).to.equal('ABADFEED')
      })
    })
  })
})
