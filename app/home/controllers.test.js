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
        const sections = [
          'outgoing',
          'incoming',
          'singleRequests',
          'allocations',
        ]
        expect(params).to.have.all.keys(
          'pageTitle',
          'sections',
          'currentWeek',
          'today'
        )
        expect(params.pageTitle).to.equal('dashboard::page_title')
        expect(params.sections).to.have.all.keys(sections)
        sections.forEach(section => {
          const fields = ['permission', 'heading', 'filter', 'period']
          expect(params.sections[section]).to.have.all.keys(fields)
          expect(params.sections[section].permission).to.be.a('string')
          expect(params.sections[section].heading).to.be.a('string')
          expect(params.sections[section].filter).to.be.an('array')
          expect(params.sections[section].period).to.be.a('string')
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
