const controllers = require('./controllers')

describe('Home controllers', function () {
  describe('#dashboard()', function () {
    let req, res

    beforeEach(function () {
      req = {
        filterSingleRequests: ['foo', 'bar'],
        filterAllocations: ['fizz', 'buzz'],
        filterIncoming: ['fuzz', 'bang'],
        filterOutgoing: ['jon', 'doe'],
        session: {
          user: {
            permissions: [],
          },
        },
      }
      res = {
        render: sinon.spy(),
        redirect: sinon.spy(),
      }
    })

    context('with correct permission', function () {
      beforeEach(function () {
        req.session.user.permissions = ['dashboard:view']

        controllers.dashboard(req, res)
      })

      it('should not redirect', function () {
        expect(res.redirect).not.to.be.called
      })

      it('should render template', function () {
        expect(res.render).to.be.calledOnce
      })

      it('should call correct template', function () {
        expect(res.render.args[0][0]).to.equal('home/dashboard')
      })

      it('should return locations sorted by title', function () {
        const params = res.render.args[0][1]
        expect(params).to.deep.equal({
          pageTitle: 'dashboard::page_title',
          sections: {
            outgoing: {
              permission: 'moves:view:outgoing',
              heading: 'dashboard::sections.outgoing.heading',
              filter: req.filterOutgoing,
            },
            incoming: {
              permission: 'moves:view:incoming',
              heading: 'dashboard::sections.incoming.heading',
              filter: req.filterIncoming,
            },
            singleRequests: {
              permission: 'moves:view:proposed',
              heading: 'dashboard::sections.single_requests.heading',
              filter: req.filterSingleRequests,
            },
            allocations: {
              permission: 'allocations:view',
              heading: 'dashboard::sections.allocations.heading',
              filter: req.filterAllocations,
            },
          },
        })
      })
    })

    context('without correct permission', function () {
      beforeEach(function () {
        controllers.dashboard(req, res)
      })

      it('should redirect to moves', function () {
        expect(res.redirect).to.be.calledOnceWithExactly('/moves')
      })

      it('should not render template', function () {
        expect(res.render).not.to.be.called
      })
    })
  })
})
