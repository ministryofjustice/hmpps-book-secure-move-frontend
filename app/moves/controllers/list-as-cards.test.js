const permissions = require('../../../common/middleware/permissions')

const controller = require('./list-as-cards')

const mockActiveMovesByDate = [
  { foo: 'bar', status: 'requested' },
  { fizz: 'buzz', status: 'requested' },
]
const mockCancelledMovesByDate = [
  { foo: 'bar', status: 'cancelled' },
  { fizz: 'buzz', status: 'cancelled' },
]
const mockPagination = {
  next: '/next',
  prev: '/prev',
}

describe('Moves controllers', function() {
  describe('#listAsCards()', function() {
    let req, res

    beforeEach(function() {
      req = {
        pagination: mockPagination,
        params: {},
        resultsAsCards: {
          active: mockActiveMovesByDate,
          cancelled: mockCancelledMovesByDate,
        },
      }
      res = {
        locals: {},
        render: sinon.spy(),
      }
    })

    describe('template params', function() {
      beforeEach(function() {
        controller(req, res)
      })

      it('should contain a page title', function() {
        expect(res.render.args[0][1]).to.have.property('pageTitle')
      })

      it('should contain resultsAsCards property', function() {
        const params = res.render.args[0][1]
        expect(params).to.have.property('resultsAsCards')
        expect(params.resultsAsCards).to.deep.equal({
          active: mockActiveMovesByDate,
          cancelled: mockCancelledMovesByDate,
        })
      })

      it('should contain pagination property', function() {
        const params = res.render.args[0][1]
        expect(params).to.have.property('pagination')
        expect(params.pagination).to.deep.equal(mockPagination)
      })

      it('should contain correct number of properties', function() {
        const params = res.render.args[0][1]
        expect(Object.keys(params)).to.have.length(3)
      })
    })

    describe('template', function() {
      beforeEach(function() {
        sinon.stub(permissions, 'check')
      })

      context(
        'if user can view move and individual location requested',
        function() {
          beforeEach(function() {
            req.session = {
              user: {
                permissions: ['move:view'],
              },
            }
            req.params = {
              locationId: '83a4208b-21a5-4b1d-a576-5d9513e0b910',
            }
            permissions.check.withArgs('move:view', ['move:view']).returns(true)

            controller(req, res)
          })

          it('should render list template', function() {
            const template = res.render.args[0][0]

            expect(res.render).to.be.calledOnce
            expect(template).to.equal('moves/views/list-as-cards')
          })
        }
      )

      context('if user can view move and all locations requested', function() {
        beforeEach(function() {
          req.session = {
            user: {
              permissions: ['move:view'],
            },
          }

          permissions.check.withArgs('move:view', ['move:view']).returns(true)

          controller(req, res)
        })

        it('should render download template', function() {
          const template = res.render.args[0][0]

          expect(res.render).to.be.calledOnce
          expect(template).to.equal('moves/views/download')
        })
      })

      context('if user cannot view move', function() {
        beforeEach(function() {
          permissions.check.returns(false)
          controller(req, res)
        })

        it('should render download template', function() {
          const template = res.render.args[0][0]

          expect(res.render).to.be.calledOnce
          expect(template).to.equal('moves/views/download')
        })
      })
    })
  })
})
