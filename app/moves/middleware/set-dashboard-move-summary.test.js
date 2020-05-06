const middleware = require('./set-dashboard-move-summary')

describe('Moves middleware', function() {
  describe('#setDashboardMoveSummary()', function() {
    context('with req.filter', function() {
      let locals, req
      const next = sinon.spy()

      beforeEach(function() {
        req = {
          filter: [
            {
              status: 'pending',
              value: 8,
              href: '/pending',
            },
            {
              status: 'rejected',
              value: 5,
              href: '/rejected',
            },
            {
              status: 'approved',
              value: 2,
              href: '/approved',
            },
          ],
        }
        locals = {}
        middleware(req, { locals }, next)
      })

      afterEach(function() {
        next.resetHistory()
      })

      it('adds a new type called total ', function() {
        expect(
          locals.dashboardMoveSummary.find(type => {
            return type.status === 'total'
          })
        ).to.exist
      })

      it('maps all requested types of moves ', function() {
        expect(locals.dashboardMoveSummary.length).to.equal(3)
      })

      it('drops the proposed moves', function() {
        expect(locals.dashboardMoveSummary).to.deep.equal([
          {
            status: 'total',
            value: 15,
            href: '/pending',
            label: 'sent for review',
          },
          {
            status: 'rejected',
            value: 5,
            href: '/rejected',
          },
          {
            status: 'approved',
            value: 2,
            href: '/approved',
          },
        ])
      })

      it('calls next', function() {
        expect(next).to.have.been.calledOnceWithExactly()
      })
    })
  })
})
