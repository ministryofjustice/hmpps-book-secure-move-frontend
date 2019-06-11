const presenters = require('../../common/presenters')
const moveService = require('../../common/services/move')

const controllers = require('./controllers')

const movesStub = {
  data: [
    { foo: 'bar' },
    { fizz: 'buzz' },
  ],
}
const errorStub = new Error('Problem')

describe('Dashboard app', function () {
  describe('#getController()', function () {
    beforeEach(function () {
      sinon.stub(presenters, 'movesByToLocation').returnsArg(0)
    })

    context('when query contains no move date', function () {
      const mockDate = '2017-08-10'
      let req, res

      beforeEach(async function () {
        sinon.stub(moveService, 'getMovesByDate').resolves(movesStub)
        this.clock = sinon.useFakeTimers(new Date(mockDate).getTime())

        req = { query: {} }
        res = { render: sinon.spy() }

        await controllers.get(req, res)
      })

      afterEach(function () {
        this.clock.restore()
      })

      it('should render a template', function () {
        expect(res.render.calledOnce).to.be.true
      })

      describe('template params', function () {
        it('should contain a page title', function () {
          expect(res.render.args[0][1]).to.have.property('pageTitle')
        })

        it('should contain move date as current date', function () {
          const params = res.render.args[0][1]
          expect(params).to.have.property('moveDate')
          expect(params.moveDate).to.equal(mockDate)
        })

        it('should contain pagination with correct links', function () {
          const params = res.render.args[0][1]
          expect(params).to.have.property('pagination')
          expect(params.pagination.nextUrl).to.equal('?move-date=2017-08-11')
          expect(params.pagination.prevUrl).to.equal('?move-date=2017-08-09')
        })

        it('should contain destinations property', function () {
          const params = res.render.args[0][1]
          expect(params).to.have.property('destinations')
          expect(params.destinations).to.deep.equal(movesStub.data)
        })
      })
    })

    context('when query contatins a move date', function () {
      const mockDate = '2018-05-10'
      let req, res

      beforeEach(async function () {
        sinon.stub(moveService, 'getMovesByDate').resolves(movesStub)

        req = {
          query: {
            'move-date': mockDate,
          },
        }
        res = { render: sinon.spy() }

        await controllers.get(req, res)
      })

      it('should render a template', function () {
        expect(res.render.calledOnce).to.be.true
      })

      describe('template params', function () {
        it('should contain a page title', function () {
          expect(res.render.args[0][1]).to.have.property('pageTitle')
        })

        it('should contain move date as current date', function () {
          const params = res.render.args[0][1]
          expect(params).to.have.property('moveDate')
          expect(params.moveDate).to.equal(mockDate)
        })

        it('should contain pagination with correct links', function () {
          const params = res.render.args[0][1]
          expect(params).to.have.property('pagination')
          expect(params.pagination.nextUrl).to.equal('?move-date=2018-05-11')
          expect(params.pagination.prevUrl).to.equal('?move-date=2018-05-09')
        })

        it('should contain destinations property', function () {
          const params = res.render.args[0][1]
          expect(params).to.have.property('destinations')
          expect(params.destinations).to.deep.equal(movesStub.data)
        })
      })
    })

    context('when API call returns an error', function () {
      let req, res, nextSpy

      beforeEach(async function () {
        sinon.stub(moveService, 'getMovesByDate').throws(errorStub)

        req = {
          query: {},
        }
        res = { render: sinon.spy() }
        nextSpy = sinon.spy()

        await controllers.get(req, res, nextSpy)
      })

      it('should not render a template', function () {
        expect(res.render.calledOnce).to.be.false
      })

      it('should send error to next function', function () {
        expect(nextSpy.calledOnce).to.be.true
        expect(nextSpy).to.be.calledWith(errorStub)
      })
    })
  })
})
