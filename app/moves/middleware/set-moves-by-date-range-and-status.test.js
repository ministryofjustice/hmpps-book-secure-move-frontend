const moveService = require('../../../common/services/move')

const middleware = require('./set-moves-by-date-range-and-status')

describe('Moves middleware', function() {
  describe('#setMovesByDateRangeAndStatus()', function() {
    let locals
    let req

    beforeEach(function() {
      locals = {
        dateRange: ['2019-01-01', '2019-01-07'],
        status: 'proposed',
      }
      req = {
        params: {
          status: 'proposed',
          locationId: '123',
        },
      }
    })

    it('returns next if dateRange is not defined', async function() {
      locals = {}
      const next = sinon.stub()
      await middleware(req, { locals }, next)
      expect(next).to.have.been.calledOnce
    })

    it('interrogates the data service with the range of dates', async function() {
      sinon.stub(moveService, 'getMovesByDateRangeAndStatus').resolves({})
      await middleware(req, { locals }, () => {})
      expect(moveService.getMovesByDateRangeAndStatus).to.have.been.calledWith({
        dateRange: ['2019-01-01', '2019-01-07'],
        fromLocationId: '123',
        status: 'proposed',
      })
      moveService.getMovesByDateRangeAndStatus.restore()
    })

    it('in case of errors, it passes it to next()', async function() {
      sinon
        .stub(moveService, 'getMovesByDateRangeAndStatus')
        .rejects(new Error('Error!'))
      const next = sinon.stub()
      await middleware(req, { locals }, next)
      expect(next).to.have.been.calledWith(sinon.match.has('message', 'Error!'))
      moveService.getMovesByDateRangeAndStatus.restore()
    })
  })
})
