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
