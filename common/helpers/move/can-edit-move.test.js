const { canEditMove } = require('./can-edit-move')

describe('Move helpers', function () {
  describe('#canEditMove', function () {
    let canAccessStub

    beforeEach(function () {
      canAccessStub = sinon.stub().returns(true)
    })

    context('without args', function () {
      it('should return false', function () {
        expect(canEditMove()).to.be.false
      })
    })

    context('with move that has left custody', function () {
      it('should return false', function () {
        expect(
          canEditMove({ _hasLeftCustody: true }, canAccessStub)
        ).to.be.false
      })

      context('with access', function () {
        it('should return false', function () {
          canAccessStub.returns(true)

          expect(
            canEditMove({ _hasLeftCustody: true }, canAccessStub)
          ).to.be.false
        })
      })
    })

    context('with move that has not left custody', function () {
      let mockMove

      beforeEach(function () {
        mockMove = {
          _hasLeftCustody: false,
          move_type: 'court_appearance',
        }
      })

      context('without update access', function () {
        beforeEach(function () {
          canAccessStub.withArgs('move:update').returns(false)
        })

        context('without update access to move type', function () {
          it('should return false', function () {
            canAccessStub
              .withArgs('move:update:court_appearance')
              .returns(false)

            expect(canEditMove(mockMove, canAccessStub)).to.be.false
          })
        })

        context('with update access to move type', function () {
          it('should return false', function () {
            canAccessStub.withArgs('move:update:court_appearance').returns(true)

            expect(canEditMove(mockMove, canAccessStub)).to.be.false
          })
        })
      })

      context('with update access', function () {
        beforeEach(function () {
          canAccessStub.withArgs('move:update').returns(true)
        })

        context('without update access to move type', function () {
          it('should return false', function () {
            canAccessStub
              .withArgs('move:update:court_appearance')
              .returns(false)

            expect(canEditMove(mockMove, canAccessStub)).to.be.false
          })
        })

        context('with update access to move type', function () {
          it('should return false', function () {
            canAccessStub.withArgs('move:update:court_appearance').returns(true)

            expect(canEditMove(mockMove, canAccessStub)).to.be.true
          })
        })
      })
    })
  })
})
