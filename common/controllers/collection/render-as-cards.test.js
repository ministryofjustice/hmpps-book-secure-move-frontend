const permissions = require('../../middleware/permissions')

const controller = require('./render-as-cards')

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

describe('Collection controllers', function () {
  describe('#renderAsCards()', function () {
    let req, res

    beforeEach(function () {
      req = {
        actions: ['1', '2'],
        context: 'listContext',
        pagination: mockPagination,
        params: {
          dateRange: ['2020-10-01', '2020-10-10'],
          period: 'day',
        },
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

    describe('template params', function () {
      beforeEach(function () {
        controller(req, res)
      })

      it('should contain actions property', function () {
        const params = res.render.args[0][1]
        expect(params).to.have.property('actions')
        expect(params.actions).to.deep.equal(['1', '2'])
      })

      it('should contain context property', function () {
        const params = res.render.args[0][1]
        expect(params).to.have.property('context')
        expect(params.context).to.equal('listContext')
      })

      it('should contain resultsAsCards property', function () {
        const params = res.render.args[0][1]
        expect(params).to.have.property('resultsAsCards')
        expect(params.resultsAsCards).to.deep.equal({
          active: mockActiveMovesByDate,
          cancelled: mockCancelledMovesByDate,
        })
      })

      it('should contain dateRange property', function () {
        const params = res.render.args[0][1]
        expect(params).to.have.property('dateRange')
        expect(params.dateRange).to.deep.equal(req.params.dateRange)
      })

      it('should contain period property', function () {
        const params = res.render.args[0][1]
        expect(params).to.have.property('period')
        expect(params.period).to.deep.equal(req.params.period)
      })

      it('should contain displayRelativeDate property', function () {
        const params = res.render.args[0][1]
        expect(params).to.have.property('displayRelativeDate')
        expect(params.displayRelativeDate).to.equal(false)
      })

      it('should contain correct number of properties', function () {
        const params = res.render.args[0][1]
        expect(Object.keys(params)).to.have.length(7)
      })
    })

    describe('template', function () {
      beforeEach(function () {
        sinon.stub(permissions, 'check')
      })

      context(
        'if user can view move and individual location requested',
        function () {
          beforeEach(function () {
            req.session = {
              user: {
                permissions: ['move:view'],
              },
            }
            req.params = {
              locationId: '83a4208b-21a5-4b1d-a576-5d9513e0b910',
              dateRange: ['2020-10-01', '2020-10-10'],
            }
            permissions.check.withArgs('move:view', ['move:view']).returns(true)

            controller(req, res)
          })

          it('should render list template', function () {
            const template = res.render.args[0][0]

            expect(res.render).to.be.calledOnce
            expect(template).to.equal('collection-as-cards')
          })
        }
      )

      context('if user can view move and all locations requested', function () {
        beforeEach(function () {
          req.session = {
            user: {
              permissions: ['move:view'],
            },
          }

          permissions.check.withArgs('move:view', ['move:view']).returns(true)

          controller(req, res)
        })

        it('should render download template', function () {
          const template = res.render.args[0][0]

          expect(res.render).to.be.calledOnce
          expect(template).to.equal('moves/views/download')
        })
      })

      context('if user cannot view move', function () {
        beforeEach(function () {
          permissions.check.returns(false)
          controller(req, res)
        })

        it('should render download template', function () {
          const template = res.render.args[0][0]

          expect(res.render).to.be.calledOnce
          expect(template).to.equal('moves/views/download')
        })
      })
    })
  })
})
