const presenters = require('../../../common/presenters')
const permissions = require('../../../common/middleware/permissions')

const controller = require('./list')

const mockRequestedMovesByDate = [
  { foo: 'bar', status: 'requested' },
  { fizz: 'buzz', status: 'requested' },
]
const mockCancelledMovesByDate = [
  { foo: 'bar', status: 'cancelled' },
  { fizz: 'buzz', status: 'cancelled' },
]

describe('Moves controllers', function() {
  describe('#list()', function() {
    const mockMoveDate = '2019-10-10'
    let req, res, moveToCardComponentMapStub

    beforeEach(function() {
      moveToCardComponentMapStub = sinon.stub().returnsArg(0)
      this.clock = sinon.useFakeTimers(new Date(mockMoveDate).getTime())
      sinon.stub(presenters, 'movesByToLocation').returnsArg(0)
      sinon
        .stub(presenters, 'moveToCardComponent')
        .callsFake(() => moveToCardComponentMapStub)
      req = { query: {} }
      res = {
        locals: {
          moveDate: mockMoveDate,
          requestedMovesByDate: mockRequestedMovesByDate,
          cancelledMovesByDate: mockCancelledMovesByDate,
        },
        render: sinon.spy(),
      }
    })

    afterEach(function() {
      this.clock.restore()
    })

    describe('template params', function() {
      beforeEach(function() {
        controller(req, res)
      })

      it('should contain a page title', function() {
        expect(res.render.args[0][1]).to.have.property('pageTitle')
      })

      it('should contain pagination with correct links', function() {
        const params = res.render.args[0][1]
        expect(params).to.have.property('pagination')
        expect(params.pagination.todayUrl).to.equal('?move-date=2019-10-10')
        expect(params.pagination.nextUrl).to.equal('?move-date=2019-10-11')
        expect(params.pagination.prevUrl).to.equal('?move-date=2019-10-09')
      })

      it('should call movesByToLocation presenter', function() {
        expect(presenters.movesByToLocation).to.be.calledOnceWithExactly(
          mockRequestedMovesByDate
        )
      })

      it('should call moveToCardComponent presenter', function() {
        expect(presenters.moveToCardComponent).to.be.calledOnceWithExactly({
          showMeta: false,
          showTags: false,
        })
        expect(moveToCardComponentMapStub).to.be.calledTwice
      })

      it('should contain destinations property', function() {
        const params = res.render.args[0][1]
        expect(params).to.have.property('destinations')
        expect(params.destinations).to.deep.equal(mockRequestedMovesByDate)
      })
    })

    describe('template', function() {
      beforeEach(function() {
        sinon.stub(permissions, 'check')
      })

      context('if user can view move', function() {
        beforeEach(function() {
          req.session = {
            user: {
              permissions: ['move:view'],
            },
          }

          permissions.check.withArgs('move:view', ['move:view']).returns(true)

          controller(req, res)
        })

        it('should render list template', function() {
          const template = res.render.args[0][0]

          expect(res.render.calledOnce).to.be.true
          expect(template).to.equal('moves/views/list')
        })
      })

      context('if user cannot view move', function() {
        beforeEach(function() {
          permissions.check.returns(false)
          controller(req, res)
        })

        it('should render download template', function() {
          const template = res.render.args[0][0]

          expect(res.render.calledOnce).to.be.true
          expect(template).to.equal('moves/views/download')
        })
      })
    })
  })
})
