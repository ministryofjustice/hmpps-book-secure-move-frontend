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
        canAccess: sinon.stub().returns(false),
        actions: ['1', '2'],
        context: 'listContext',
        datePagination: mockPagination,
        filter: [
          { label: 'bar', value: 2 },
          { label: 'foo', value: 6 },
          { label: 'fizz', value: 3 },
          { label: 'buzz', value: 7 },
        ],
        query: {
          status: 'complete',
        },
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
      context('by default', function () {
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

        it('should contain datePagination property', function () {
          const params = res.render.args[0][1]
          expect(params).to.have.property('datePagination')
          expect(params.datePagination).to.deep.equal(req.datePagination)
        })

        it('should contain period property', function () {
          const params = res.render.args[0][1]
          expect(params).to.have.property('period')
          expect(params.period).to.deep.equal(req.params.period)
        })

        it('should contain filter property', function () {
          const params = res.render.args[0][1]
          expect(params).to.have.property('filter')
          expect(params.filter).to.deep.equal(req.filter)
        })

        it('should contain activeStatus property', function () {
          const params = res.render.args[0][1]
          expect(params).to.have.property('activeStatus')
          expect(params.activeStatus).to.deep.equal(req.query.status)
        })

        it('should contain total results property', function () {
          const params = res.render.args[0][1]
          expect(params).to.have.property('totalResults')
          expect(params.totalResults).to.deep.equal(18)
        })

        it('should contain correct number of properties', function () {
          const params = res.render.args[0][1]
          expect(Object.keys(params)).to.have.length(10)
        })
      })

      context('with different display location', function () {
        beforeEach(function () {
          res.locals.CURRENT_LOCATION = {
            id: 'FACEFEED',
          }

          req.location = {
            id: 'ABADCAFE',
          }

          req.actions = [
            { permission: 'move:create' },
            { permission: 'move:view' },
          ]

          controller(req, res)
        })

        it('should contain location property', function () {
          const params = res.render.args[0][1]
          expect(params).to.have.property('location')
          expect(params.location).to.deep.equal({ id: 'ABADCAFE' })
        })

        it('should filter actions', function () {
          const params = res.render.args[0][1]
          expect(params).to.have.property('actions')
          expect(params.actions).to.deep.equal([{ permission: 'move:view' }])
        })

        it('should contain correct number of properties', function () {
          const params = res.render.args[0][1]
          expect(Object.keys(params)).to.have.length(11)
        })
      })

      context('with disabled display location', function () {
        beforeEach(function () {
          res.locals.CURRENT_LOCATION = {
            id: 'FACEFEED',
            disabled_at: '1999-10-10',
          }

          req.location = {
            id: 'FACEFEED',
            disabled_at: '1999-10-10',
          }

          req.actions = [
            { permission: 'move:create' },
            { permission: 'move:view' },
          ]

          controller(req, res)
        })

        it('should contain location property', function () {
          const params = res.render.args[0][1]
          expect(params).to.have.property('location')
          expect(params.location).to.deep.equal({
            id: 'FACEFEED',
            disabled_at: '1999-10-10',
          })
        })

        it('should filter actions', function () {
          const params = res.render.args[0][1]
          expect(params).to.have.property('actions')
          expect(params.actions).to.deep.equal([{ permission: 'move:view' }])
        })

        it('should contain correct number of properties', function () {
          const params = res.render.args[0][1]
          expect(Object.keys(params)).to.have.length(11)
        })
      })
    })

    describe('template', function () {
      context(
        'if user can view move and individual location requested',
        function () {
          beforeEach(function () {
            req.location = {
              id: '83a4208b-21a5-4b1d-a576-5d9513e0b910',
            }
            req.params = {
              dateRange: ['2020-10-01', '2020-10-10'],
            }
            req.canAccess.withArgs('move:view').returns(true)

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
          req.canAccess.withArgs('move:view').returns(true)

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
