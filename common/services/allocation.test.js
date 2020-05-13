const apiClient = require('../lib/api-client')()

const allocationService = require('./allocation')
describe('cancel', function() {
  let outcome
  beforeEach(async function() {
    sinon.stub(apiClient, 'post').resolves({
      data: {
        events: [],
      },
    })
    sinon.spy(apiClient, 'one')
    sinon.spy(apiClient, 'all')
    outcome = await allocationService.cancel('123')
  })
  it('calls the service to post an event', function() {
    expect(apiClient.post).to.have.been.calledOnceWithExactly({
      event_name: 'cancel',
      timestamp: sinon.match.string,
    })
  })
  it('returns the data', function() {
    expect(outcome).to.deep.equal({
      events: [],
    })
  })
})
describe('format', function() {
  let output
  beforeEach(function() {
    output = allocationService.format({
      moves_count: '3',
      from_location: '9d0805d2-1bcc-4837-a8c5-025c3d8288b3',
      complex_cases: [
        {
          key: 'hold_separately',
          title: 'Segregated prisoners',
          allocation_complex_case_id: 'afa79a37-7c2f-4363-bed6-e1ccf2576901',
          answer: true,
        },
      ],
      complete_in_full: 'false',
    })
  })
  it('formats the boolean fields expressed as strings', function() {
    expect(output.complete_in_full).to.be.a('boolean')
    expect(output.complete_in_full).to.be.false
  })
  it('formats the relationships as expected', function() {
    expect(output.from_location).to.deep.equal({
      id: '9d0805d2-1bcc-4837-a8c5-025c3d8288b3',
    })
  })
  it('passes through other values unchanged', function() {
    expect(output.moves_count).to.equal('3')
  })
})
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
describe('#getById', function() {
  let output
  const mockResponse = {
    id: '8567f1a5-2201-4bc2-b655-f6526401303a',
    type: 'allocations',
  }
  beforeEach(async function() {
    sinon.stub(apiClient, 'find').resolves({
      data: mockResponse,
    })
    output = await allocationService.getById(
      '8567f1a5-2201-4bc2-b655-f6526401303a'
    )
  })
  it('calls the api service', function() {
    expect(apiClient.find).to.have.been.calledOnceWith(
      'allocation',
      '8567f1a5-2201-4bc2-b655-f6526401303a'
    )
  })
  it('returns the data from the api service', function() {
    expect(output).to.deep.equal(mockResponse)
  })
})
describe('#create', function() {
  let output
  const mockResponse = {
    id: '8567f1a5-2201-4bc2-b655-f6526401303a',
    type: 'allocations',
  }
  beforeEach(async function() {
    sinon.stub(apiClient, 'create').resolves({
      data: {
        success: true,
      },
    })
    sinon.stub(allocationService, 'format').returns({
      formattedData: {},
    })
    output = await allocationService.create(mockResponse)
  })
  it('formattes the data', function() {
    expect(allocationService.format).to.have.been.calledWithExactly(
      mockResponse
    )
  })
  it('sends the data to the api', function() {
    expect(apiClient.create).to.have.been.calledWithExactly('allocation', {
      formattedData: {},
    })
  })
  it('returns the response', function() {
    expect(output).to.deep.equal({
      success: true,
    })
  })
})
