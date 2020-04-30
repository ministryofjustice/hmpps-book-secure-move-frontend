const proxyquire = require('proxyquire')

const componentService = require('../../common/services/component')
const filters = require('../../config/nunjucks/filters')

const tablePresenters = require('./table')

const mockMoves = [
  {
    id: 'acba3ad5-a8d3-4b95-9e48-121dafb3babe',
    type: 'moves',
    reference: 'TEW5896J',
    status: 'proposed',
    updated_at: '2020-04-20T11:48:53+01:00',
    created_at: '2020-04-20T11:48:53+01:00',
    prison_transfer_reason: {
      title: 'MAPPA',
    },
    time_due: null,
    date: null,
    move_type: 'prison_transfer',
    date_from: '2020-09-28',
    date_to: '2020-10-28',
    person: {
      id: '746ad25b-9d6b-4159-ba45-d4a62936c48d',
      type: 'people',
      first_names: 'JOHN',
      last_name: 'DOE',
      identifiers: [
        {
          identifier_type: 'police_national_computer',
          value: '17/522710A',
        },
        {
          identifier_type: 'prison_number',
          value: 'A5075DA',
        },
      ],
      fullname: 'DOE, JOHN',
    },
    from_location: {
      id: '54d1c8c3-699e-4198-9218-f923a7f18149',
      type: 'locations',
      key: 'wyi',
      title: 'WETHERBY (HMPYOI)',
      location_type: 'prison',
    },
    to_location: {
      id: 'cb0c3a4d-011a-47e5-9dca-05a418047cfd',
      type: 'locations',
      key: 'ali',
      title: 'ALBANY (HMP)',
      location_type: 'prison',
    },
  },
  {
    id: '394f107e-da78-45d4-900c-c95717179f68',
    type: 'moves',
    reference: 'UYN4638F',
    status: 'proposed',
    updated_at: '2020-04-21T10:56:02+01:00',
    created_at: '2020-04-21T10:56:02+01:00',
    prison_transfer_reason: null,
    time_due: null,
    date: null,
    move_type: 'prison_transfer',
    date_from: '2020-05-01',
    date_to: null,
    person: {
      id: '746ad25b-9d6b-4159-ba45-d4a62936c54s',
      type: 'people',
      first_names: 'JANE',
      last_name: 'DOE',
      identifiers: [
        {
          identifier_type: 'police_national_computer',
          value: '17/522710W',
        },
        {
          identifier_type: 'prison_number',
          value: 'A5075DY',
        },
      ],
      fullname: 'DOE, JANE',
    },
    from_location: {
      id: '54d1c8c3-699e-4198-9218-f923a7f18149',
      type: 'locations',
      key: 'wyi',
      title: 'WETHERBY (HMPYOI)',
    },
    to_location: {
      id: 'b7fd1648-ddbc-4c9c-9221-05d67d182488',
      type: 'locations',
      key: 'hmp_northallerton',
      title: 'HMP Northallerton',
    },
  },
]
const moveToCardComponentStub = sinon.stub().returnsArg(0)
const moveToCardComponentOptsStub = sinon
  .stub()
  .callsFake(() => moveToCardComponentStub)

const presenter = proxyquire('./moves-to-table', {
  './move-to-card-component': moveToCardComponentOptsStub,
})

describe('#movesToTable', function() {
  let output
  beforeEach(function() {
    sinon.stub(tablePresenters, 'objectToTableHead').callsFake(arg => {
      return { html: arg.head }
    })
    sinon.stub(filters, 'formatDate').returnsArg(0)
    sinon.stub(filters, 'formatDateRange').returnsArg(0)
    sinon.stub(componentService, 'getComponent').returnsArg(0)
    output = presenter([])
  })
  it('returns an object with movesHeads', function() {
    expect(output.movesHeads).to.exist
    expect(output.movesHeads).to.be.an('array')
  })
  it('returns an object with moves', function() {
    expect(output.moves).to.exist
    expect(output.moves).to.be.an('array')
  })
  describe('its behaviour', function() {
    let output
    beforeEach(function() {
      output = presenter(mockMoves)
    })
    it('returns html with composite name on the first cell', function() {
      expect(output.moves[0][0]).to.deep.equal({
        html: 'appCard',
        attributes: {
          scope: 'row',
        },
      })
    })
    it('should call card component with correct arguments', function() {
      expect(moveToCardComponentOptsStub).to.be.calledWithExactly({
        isCompact: true,
      })
      expect(moveToCardComponentStub).to.be.calledWithExactly(mockMoves[0])
    })
    it('returns html with createdAt on the second cell', function() {
      expect(output.moves[0][1]).to.deep.equal({
        html: mockMoves[0].created_at,
      })
    })
    it('returns toLocation on the third cell', function() {
      expect(output.moves[0][2]).to.deep.equal({
        html: mockMoves[0].to_location.title,
      })
    })
    it('returns the date range on the fourth cell', function() {
      expect(output.moves[0][3]).to.deep.equal({
        html: mockMoves[0].date_from,
      })
    })
    it('returns the move type on the fifth cell', function() {
      expect(output.moves[0][4]).to.deep.equal({
        html: mockMoves[0].prison_transfer_reason.title,
      })
    })
    it('returns empty string with null prison transfer reason', function() {
      expect(output.moves[1][4]).to.deep.equal({
        html: '',
      })
    })
    it('returns a row per record', function() {
      expect(output.moves.length).to.equal(2)
    })
    it('returns one head row with all the cells', function() {
      expect(output.movesHeads).to.deep.equal([
        {
          html: 'name',
        },
        {
          html: 'moves::dashboard.created_at',
        },
        {
          html: 'moves::dashboard.move_to',
        },
        {
          html: 'moves::dashboard.earliest_move_date',
        },
        {
          html: 'moves::dashboard.move_type',
        },
      ])
    })
  })
})
