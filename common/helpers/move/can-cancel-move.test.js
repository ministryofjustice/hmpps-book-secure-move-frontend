const canCancelMove = require('./can-cancel-move')

describe('Move helpers', function () {
  describe('#canCancelMove', function () {
    let move, canAccessStub

    beforeEach(function () {
      move = {}
      canAccessStub = sinon.stub().returns(false)
    })

    describe('cancellable statuses', function () {
      const cancellableStatuses = ['requested', 'booked']
      cancellableStatuses.forEach(test => {
        context(`with ${test} status`, function () {
          beforeEach(function () {
            move.status = test
          })

          context('when move is not part of an allocation', function () {
            it('should be allowed', function () {
              canAccessStub.withArgs('move:cancel').returns(true)
              move.allocation = null
              expect(canCancelMove(move, canAccessStub)).to.be.true
            })
          })

          context('when move is part of an allocation', function () {
            it('should not be allowed', function () {
              canAccessStub.withArgs('move:cancel').returns(true)
              move.allocation = { id: '__allocation__' }
              expect(canCancelMove(move, canAccessStub)).to.be.false
            })
          })

          context('without cancel permission', function () {
            it('should not be allowed', function () {
              canAccessStub.withArgs('move:cancel').returns(false)
              expect(canCancelMove(move, canAccessStub)).to.be.false
            })
          })
        })
      })
    })

    describe('uncancellable statuses', function () {
      const uncancellableStatuses = ['in_transit', 'completed']
      uncancellableStatuses.forEach(test => {
        context(`with ${test} status`, function () {
          beforeEach(function () {
            move.status = test
          })

          context('when move is not part of an allocation', function () {
            it('should not be allowed', function () {
              move.allocation = null
              expect(canCancelMove(move, canAccessStub)).to.be.false
            })
          })

          context('when move is part of an allocation', function () {
            it('should not be allowed', function () {
              move.allocation = { id: '__allocation__' }
              expect(canCancelMove(move, canAccessStub)).to.be.false
            })
          })

          context('without cancel permission', function () {
            it('should not be allowed', function () {
              canAccessStub.withArgs('move:cancel').returns(false)
              expect(canCancelMove(move, canAccessStub)).to.be.false
            })
          })
        })
      })
    })

    describe('proposed moves', function () {
      beforeEach(function () {
        move.status = 'proposed'
      })

      context('without cancel permission', function () {
        it('should be allowed', function () {
          canAccessStub.withArgs('move:cancel:proposed').returns(true)
          expect(canCancelMove(move, canAccessStub)).to.be.true
        })
      })

      context('without cancel permission', function () {
        it('should not be allowed', function () {
          canAccessStub.withArgs('move:cancel:proposed').returns(false)
          expect(canCancelMove(move, canAccessStub)).to.be.false
        })
      })
    })
  })
})
