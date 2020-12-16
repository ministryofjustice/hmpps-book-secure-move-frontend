const proxyquire = require('proxyquire')

const courtHearingToSummaryListComponent = sinon
  .stub()
  .returns('court-hearing-summary-list')

const presenters = {
  courtHearingToSummaryListComponent,
}

const getCourtHearings = proxyquire('./get-court-hearings', {
  '../../presenters': presenters,
})

describe('Move helpers', function () {
  const move = {
    id: 'moveId',
    court_hearings: [
      {
        id: '1',
        start_time: '2020-10-20T13:00:00+00:00',
        case_number: 'T12345',
      },
      {
        id: '2',
        start_time: '2020-10-20T20:00:00+00:00',
        case_number: 'S12345',
      },
      {
        id: '3',
        start_time: '2020-10-20T09:00:00+00:00',
        case_number: 'S67890',
      },
      {
        id: '4',
        start_time: '2020-10-20T16:30:00+00:00',
        case_number: 'T001144',
      },
      {
        id: '5',
        start_time: '2020-10-20T11:20:00+00:00',
        case_number: 'T66992277',
      },
    ],
  }

  describe('#getCourtHearings', function () {
    let courtHearings

    beforeEach(function () {
      courtHearingToSummaryListComponent.resetHistory()
    })

    context('when calling the method', function () {
      beforeEach(function () {
        courtHearings = getCourtHearings(move)
      })

      it('should send the court hearings to the presenter in the correct order', function () {
        expect(courtHearingToSummaryListComponent.callCount).to.equal(5)
        expect(
          courtHearingToSummaryListComponent.getCall(0)
        ).to.be.calledWithExactly(move.court_hearings[2])
        expect(
          courtHearingToSummaryListComponent.getCall(1)
        ).to.be.calledWithExactly(move.court_hearings[4])
        expect(
          courtHearingToSummaryListComponent.getCall(2)
        ).to.be.calledWithExactly(move.court_hearings[0])
        expect(
          courtHearingToSummaryListComponent.getCall(3)
        ).to.be.calledWithExactly(move.court_hearings[3])
        expect(
          courtHearingToSummaryListComponent.getCall(4)
        ).to.be.calledWithExactly(move.court_hearings[1])
      })

      it('should return the court hearings data', function () {
        expect(courtHearings).to.deep.equal([
          {
            id: '3',
            start_time: '2020-10-20T09:00:00+00:00',
            case_number: 'S67890',
            summaryList: 'court-hearing-summary-list',
          },
          {
            id: '5',
            start_time: '2020-10-20T11:20:00+00:00',
            case_number: 'T66992277',
            summaryList: 'court-hearing-summary-list',
          },
          {
            id: '1',
            start_time: '2020-10-20T13:00:00+00:00',
            case_number: 'T12345',
            summaryList: 'court-hearing-summary-list',
          },
          {
            id: '4',
            start_time: '2020-10-20T16:30:00+00:00',
            case_number: 'T001144',
            summaryList: 'court-hearing-summary-list',
          },
          {
            id: '2',
            start_time: '2020-10-20T20:00:00+00:00',
            case_number: 'S12345',
            summaryList: 'court-hearing-summary-list',
          },
        ])
      })
    })
  })
})
