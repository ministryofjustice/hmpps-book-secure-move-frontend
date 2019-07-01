const presenters = require('../../../common/presenters')

const controllers = require('./')

const mockMovesByDate = [
  { foo: 'bar' },
  { fizz: 'buzz' },
]

describe('Moves controllers', function () {
  describe('#list()', function () {
    const mockMoveDate = '2019-10-10'
    let req, res

    beforeEach(function () {
      sinon.stub(presenters, 'movesByToLocation').returnsArg(0)
      req = { query: {} }
      res = {
        locals: {
          moveDate: mockMoveDate,
          movesByDate: mockMovesByDate,
        },
        render: sinon.spy(),
      }

      controllers.list(req, res)
    })

    it('should render a template', function () {
      expect(res.render.calledOnce).to.be.true
    })

    describe('template params', function () {
      it('should contain a page title', function () {
        expect(res.render.args[0][1]).to.have.property('pageTitle')
      })

      it('should contain pagination with correct links', function () {
        const params = res.render.args[0][1]
        expect(params).to.have.property('pagination')
        expect(params.pagination.nextUrl).to.equal('?move-date=2019-10-11')
        expect(params.pagination.prevUrl).to.equal('?move-date=2019-10-09')
      })

      it('should call movesByToLocation presenter', function () {
        expect(presenters.movesByToLocation).to.be.calledOnceWithExactly(mockMovesByDate)
      })

      it('should contain destinations property', function () {
        const params = res.render.args[0][1]
        expect(params).to.have.property('destinations')
        expect(params.destinations).to.deep.equal(mockMovesByDate)
      })
    })
  })
})
