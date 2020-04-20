const presenters = require('../../../common/presenters')
const moveService = require('../../../common/services/move')

const middleware = require('./set-move-type-navigation')

describe('Moves middleware', function() {
  describe('#setMoveTypeNavigation()', function() {
    let next
    let req
    let res

    context('happy path', function() {
      beforeEach(async function() {
        sinon.stub(moveService, 'getMovesCount').resolves(4)
        sinon.stub(presenters, 'moveTypesToFilterComponent').returnsArg(0)
        next = sinon.spy()
        req = {
          baseUrl: '/moves',
          url: '/moves/week/2010-09-07/123/proposed',
          params: {
            locationId: '123',
            date: '2010-09-07',
            period: 'week',
          },
        }
        res = {
          locals: {
            dateRange: ['2010-09-03', '2010-09-10'],
          },
        }
        await middleware(req, res, next)
      })

      afterEach(function() {
        moveService.getMovesCount.restore()
      })

      it('sets res.locals.moveTypeNavigation', function() {
        expect({ ...res.locals }).to.deep.equal({
          dateRange: ['2010-09-03', '2010-09-10'],
          moveTypeNavigation: [
            {
              active: false,
              filter: 'proposed',
              label: 'moves::dashboard.filter.proposed',
              href: '/moves/week/2010-09-07/123/proposed',
              value: 4,
            },
            {
              active: false,
              filter: 'requested,accepted,completed',
              label: 'moves::dashboard.filter.approved',
              href: '/moves/week/2010-09-07/123/requested,accepted,completed',
              value: 4,
            },
            {
              active: false,
              filter: 'rejected',
              label: 'moves::dashboard.filter.rejected',
              href: '/moves/week/2010-09-07/123/rejected',
              value: 4,
            },
          ],
        })
      })

      it('calls next', function() {
        expect(next).to.have.been.calledWithExactly()
      })

      it('returns predictable results', async function() {
        const locals1 = { ...res.locals }
        await middleware(req, res, next)
        expect(res.locals).to.deep.equal(locals1)
      })

      it('calls the presenter on each element', async function() {
        presenters.moveTypesToFilterComponent.resetHistory()
        await middleware(req, res, next)
        expect(presenters.moveTypesToFilterComponent).to.have.been.calledThrice
      })
    })

    context('unhappy path', function() {
      it('calls next with error if needed', async function() {
        sinon.stub(moveService, 'getMovesCount').rejects(new Error('Error!'))
        next = sinon.spy()
        await middleware(
          {
            baseUrl: '/moves',
            url: '/moves/week/2010-09-07/123/proposed',
            params: {
              locationId: '123',
              date: '2010-09-07',
            },
          },
          {
            locals: {
              period: 'week',
              dateRange: ['2010-09-03', '2010-09-10'],
            },
          },
          next
        )
        expect(next).to.have.been.calledWith(
          sinon.match({
            message: 'Error!',
          })
        )
        moveService.getMovesCount.restore()
      })
    })
  })
})
