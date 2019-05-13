const controllers = require('./controllers')

describe('Dashboard app', function () {
  describe('#getController()', function () {
    beforeEach(() => {
      const mockDate = new Date('2017-08-10')
      this.clock = sinon.useFakeTimers(mockDate.getTime())
    })

    afterEach(() => {
      this.clock.restore()
    })

    context('when query contains no move date', () => {
      let req, res

      beforeEach(() => {
        req = {
          query: {},
        }
        res = {
          render: sinon.spy(),
        }

        controllers.get(req, res)
      })

      it('should render a template', function () {
        expect(res.render.calledOnce).to.be.true
      })

      describe('template params', () => {
        it('should contain a page title', function () {
          expect(res.render.args[0][1]).to.have.property('pageTitle')
        })

        it('should contain move date as current date', function () {
          const params = res.render.args[0][1]
          expect(params).to.have.property('moveDate')
          expect(params.moveDate).to.equal('2017-08-10')
        })

        it('should contain pagination with correct links', function () {
          const params = res.render.args[0][1]
          expect(params).to.have.property('pagination')
          expect(params.pagination.nextUrl).to.equal('?move-date=2017-08-11')
          expect(params.pagination.prevUrl).to.equal('?move-date=2017-08-09')
        })
      })
    })

    context('when query contatins a move date', () => {
      let req, res

      beforeEach(() => {
        req = {
          query: {
            'move-date': '2018-05-10',
          },
        }
        res = {
          render: sinon.spy(),
        }

        controllers.get(req, res)
      })

      it('should render a template', function () {
        expect(res.render.calledOnce).to.be.true
      })

      describe('template params', () => {
        it('should contain a page title', function () {
          expect(res.render.args[0][1]).to.have.property('pageTitle')
        })

        it('should contain move date as current date', function () {
          const params = res.render.args[0][1]
          expect(params).to.have.property('moveDate')
          expect(params.moveDate).to.equal('2018-05-10')
        })

        it('should contain pagination with correct links', function () {
          const params = res.render.args[0][1]
          expect(params).to.have.property('pagination')
          expect(params.pagination.nextUrl).to.equal('?move-date=2018-05-11')
          expect(params.pagination.prevUrl).to.equal('?move-date=2018-05-09')
        })
      })
    })
  })
})
