const apiClient = require('../lib/api-client')()

const allocationService = require('./allocation')

describe('#getMovesCount', function() {
  let count
  const mockDateRange = ['2019-04-13', '2019-04-19']
  beforeEach(async function() {
    sinon.stub(apiClient, 'findAll').resolves({
      meta: {
        pagination: {
          total_objects: 12,
        },
      },
    })
  })
  context('by default', async function() {
    beforeEach(async function() {
      count = await allocationService.getCount({})
    })
    it('calls the api service', function() {
      expect(apiClient.findAll).to.be.calledOnceWithExactly('allocation', {
        page: 1,
        per_page: 1,
        'filter[date_from]': undefined,
        'filter[date_to]': undefined,
      })
    })
    it('returns the count', function() {
      expect(count).to.equal(12)
    })
  })
  context('with dates', async function() {
    beforeEach(async function() {
      count = await allocationService.getCount({
        dateRange: mockDateRange,
      })
    })
    it('calls the api service with the correct params', function() {
      expect(apiClient.findAll).to.be.calledOnceWithExactly('allocation', {
        page: 1,
        per_page: 1,
        'filter[date_from]': mockDateRange[0],
        'filter[date_to]': mockDateRange[1],
      })
    })
  })
})
describe('#getByStatus', function() {
  const mockResponse = [
    {
      id: '8567f1a5-2201-4bc2-b655-f6526401303a',
      type: 'allocations',
    },
    {
      id: '05140394-c517-45d9-8c24-9b4913972d87',
      type: 'allocations',
    },
  ]
  let allocations
  const mockDateRange = ['2019-04-13', '2019-04-19']
  beforeEach(async function() {
    sinon.stub(apiClient, 'findAll').resolves({
      data: mockResponse,
    })
  })
  context('by default', async function() {
    beforeEach(async function() {
      allocations = await allocationService.getByStatus({})
    })
    it('calls the api service', function() {
      expect(apiClient.findAll).to.be.calledOnceWithExactly('allocation', {
        page: 1,
        per_page: 100,
        'filter[date_from]': undefined,
        'filter[date_to]': undefined,
      })
    })
    it('returns the allocations', function() {
      expect(allocations).to.deep.equal(mockResponse)
    })
  })
  context('with dates and filter', async function() {
    beforeEach(async function() {
      await allocationService.getByStatus({
        dateRange: mockDateRange,
        additionalFilters: {
          complete_in_full: true,
        },
      })
    })
    it('calls the api service with the correct params', function() {
      expect(apiClient.findAll).to.be.calledOnceWithExactly('allocation', {
        page: 1,
        per_page: 100,
        'filter[date_from]': mockDateRange[0],
        'filter[date_to]': mockDateRange[1],
        'filter[complete_in_full]': true,
      })
    })
  })
})
