const courtHearingService = require('./court-hearing')
const apiClient = require('../lib/api-client')()

const mockCourtHearing = {
  start_time: '2020-10-20T13:00:00+00:00',
  case_number: 'T18725',
  case_start_date: '2019-10-08T10:30:00+00:00',
  case_type: 'Adult',
  comments: 'Distinctio accusantium enim libero eligendi est.',
}

describe('Court Hearing Service', function() {
  describe('#create()', function() {
    const mockData = {
      name: 'Steve Bloggs',
    }
    const mockResponse = {
      data: mockCourtHearing,
    }
    let courtHearing

    beforeEach(async function() {
      sinon.stub(apiClient, 'create').resolves(mockResponse)
      courtHearing = await courtHearingService.create(mockData)
    })

    it('should call create method with data', function() {
      expect(apiClient.create).to.be.calledOnceWithExactly(
        'court_hearing',
        mockData
      )
    })

    it('should return court hearing', function() {
      expect(courtHearing).to.deep.equal(mockResponse.data)
    })
  })
})
