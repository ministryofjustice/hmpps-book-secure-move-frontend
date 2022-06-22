const apiClient = require('../lib/api-client')()

const CourtHearingService = require('./court-hearing')
const courtHearingService = new CourtHearingService({ apiClient })

const mockCourtHearing = {
  start_time: '2020-10-20T13:00:00+00:00',
  case_number: 'T18725',
  case_start_date: '2019-10-08T10:30:00+00:00',
  case_type: 'Adult',
  comments: 'Distinctio accusantium enim libero eligendi est.',
}

describe('Court Hearing Service', function () {
  describe('#format()', function () {
    const mockMoveId = 'b695d0f0-af8e-4b97-891e-92020d6820b9'

    context('when relationship field is string', function () {
      let formatted

      beforeEach(async function () {
        formatted = await courtHearingService.format({
          date: '2010-10-10',
          move: mockMoveId,
        })
      })

      it('should format as relationship object', function () {
        expect(formatted.move).to.deep.equal({
          id: mockMoveId,
        })
      })

      it('should not affect non relationship fields', function () {
        expect(formatted.date).to.equal('2010-10-10')
      })
    })

    context('when relationship field is not a string', function () {
      let formatted

      beforeEach(async function () {
        formatted = await courtHearingService.format({
          date: '2010-10-10',
          move: {
            id: mockMoveId,
          },
        })
      })

      it('should return its original value', function () {
        expect(formatted.move).to.deep.equal({
          id: mockMoveId,
        })
      })

      it('should not affect non relationship fields', function () {
        expect(formatted.date).to.equal('2010-10-10')
      })
    })

    context('with falsey values', function () {
      let formatted

      beforeEach(async function () {
        formatted = await courtHearingService.format({
          date: '2010-10-10',
          move: {
            id: mockMoveId,
          },
          empty_string: '',
          false: false,
          undefined,
          empty_array: [],
        })
      })

      it('should remove falsey values', function () {
        expect(formatted).to.deep.equal({
          date: '2010-10-10',
          move: {
            id: mockMoveId,
          },
          empty_array: [],
        })
      })
    })
  })

  describe('#create()', function () {
    const mockData = {
      name: 'Steve Bloggs',
    }
    const mockResponse = {
      data: mockCourtHearing,
    }
    let courtHearing

    beforeEach(function () {
      sinon.stub(apiClient, 'create').resolves(mockResponse)
      sinon.stub(courtHearingService, 'format').returns(mockData)
    })

    context('by default', function () {
      beforeEach(async function () {
        courtHearing = await courtHearingService.create(mockData)
      })

      it('should create with empty params', function () {
        expect(apiClient.create).to.be.calledOnceWithExactly(
          'court_hearing',
          mockData,
          {}
        )
      })

      it('should call format', function () {
        expect(courtHearingService.format).to.be.calledOnceWithExactly(mockData)
      })

      it('should return court hearing', function () {
        expect(courtHearing).to.deep.equal(mockResponse.data)
      })
    })

    context('with disabled save set to true', function () {
      beforeEach(async function () {
        courtHearing = await courtHearingService.create(mockData, true)
      })

      it('should create with query string', function () {
        expect(apiClient.create).to.be.calledOnceWithExactly(
          'court_hearing',
          mockData,
          {
            do_not_save_to_nomis: true,
          }
        )
      })

      it('should return court hearing', function () {
        expect(courtHearing).to.deep.equal(mockResponse.data)
      })
    })

    context('with disabled save set to true', function () {
      beforeEach(async function () {
        courtHearing = await courtHearingService.create(mockData, false)
      })

      it('should create with empty params', function () {
        expect(apiClient.create).to.be.calledOnceWithExactly(
          'court_hearing',
          mockData,
          {}
        )
      })

      it('should return court hearing', function () {
        expect(courtHearing).to.deep.equal(mockResponse.data)
      })
    })
  })
})
