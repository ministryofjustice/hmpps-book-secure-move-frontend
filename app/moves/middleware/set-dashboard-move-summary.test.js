const middleware = require('./set-dashboard-move-summary')

describe('Moves middleware', function() {
  describe('#setDashboardMoveSummary()', function() {
    context('with res.locals.moveTypeNavigation', function() {
      let locals
      const next = sinon.spy()

      beforeEach(function() {
        locals = {
          moveTypeNavigation: [
            {
              filter: 'pending',
              value: 8,
              href: '/pending',
            },
            {
              filter: 'rejected',
              value: 5,
              href: '/rejected',
            },
            {
              filter: 'approved',
              value: 2,
              href: '/approved',
            },
          ],
        }
        middleware({}, { locals }, next)
      })

      afterEach(function() {
        next.resetHistory()
      })

      it('adds a new type called total ', function() {
        expect(
          locals.dashboardMoveSummary.find(type => {
            return type.filter === 'total'
          })
        ).to.exist
      })

      it('maps all requested types of moves ', function() {
        expect(locals.dashboardMoveSummary.length).to.equal(3)
      })

      it('has a total value of all the moves', function() {
        expect(
          locals.dashboardMoveSummary.find(type => {
            return type.filter === 'total'
          }).value
        ).to.equal(15)
      })

      it('has a total link to the proposed moves tab', function() {
        expect(
          locals.dashboardMoveSummary.find(type => {
            return type.filter === 'total'
          }).href
        ).to.equal('/pending')
      })

      it('drops the proposed moves', function() {
        expect(locals.dashboardMoveSummary).to.deep.equal([
          {
            filter: 'total',
            value: 15,
            href: '/pending',
            label: 'sent for review',
          },
          {
            filter: 'rejected',
            value: 5,
            href: '/rejected',
          },
          {
            filter: 'approved',
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
