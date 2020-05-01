const permissions = require('../../../common/middleware/permissions')
const presenters = require('../../../common/presenters')

const controller = require('./list')

const mockActiveMovesByDate = [
  { foo: 'bar', status: 'requested' },
  { fizz: 'buzz', status: 'requested' },
]
const mockCancelledMovesByDate = [
  { foo: 'bar', status: 'cancelled' },
  { fizz: 'buzz', status: 'cancelled' },
]

describe('Moves controllers', function() {
  describe('#list()', function() {
    let req, res, moveToCardComponentMapStub

    beforeEach(function() {
      moveToCardComponentMapStub = sinon.stub().returnsArg(0)
      sinon.stub(presenters, 'movesByToLocation').returnsArg(0)
      sinon
        .stub(presenters, 'moveToCardComponent')
        .callsFake(() => moveToCardComponentMapStub)
      req = {}
      res = {
        locals: {},
        render: sinon.spy(),
      }
    })

    describe('template params', function() {
      context('with moves', function() {
        beforeEach(function() {
          res.locals.activeMovesByDate = mockActiveMovesByDate
          res.locals.cancelledMovesByDate = mockCancelledMovesByDate

          controller(req, res)
        })

        it('should contain a page title', function() {
          expect(res.render.args[0][1]).to.have.property('pageTitle')
        })

        it('should call movesByToLocation presenter', function() {
          expect(presenters.movesByToLocation).to.be.calledOnceWithExactly(
            mockActiveMovesByDate
          )
        })

        it('should call moveToCardComponent presenter', function() {
          expect(presenters.moveToCardComponent).to.be.calledOnceWithExactly({
            showMeta: false,
            showTags: false,
            showImage: false,
          })
          expect(moveToCardComponentMapStub).to.be.calledTwice
        })

        it('should contain destinations property', function() {
          const params = res.render.args[0][1]
          expect(params).to.have.property('destinations')
          expect(params.destinations).to.deep.equal(mockActiveMovesByDate)
        })
      })

      context('without moves', function() {
        beforeEach(function() {
          controller(req, res)
        })

        it('should call movesByToLocation presenter', function() {
          expect(presenters.movesByToLocation).to.be.calledOnceWithExactly([])
        })

        it('should call moveToCardComponent presenter', function() {
          expect(presenters.moveToCardComponent).to.be.calledOnceWithExactly({
            showMeta: false,
            showTags: false,
            showImage: false,
          })
          expect(moveToCardComponentMapStub).not.to.be.called
        })
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
            res.locals = {
              fromLocationId: '83a4208b-21a5-4b1d-a576-5d9513e0b910',
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
