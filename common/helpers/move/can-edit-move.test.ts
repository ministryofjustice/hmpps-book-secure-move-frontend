import { expect } from 'chai'

import sinon from 'sinon'
import moveFactory from '../../../factories/move'
import { Move } from '../../types/move'

import { canEditMove } from './can-edit-move'

describe('Move helpers', function () {
  describe('#canEditMove', function () {
    let canAccessStub: sinon.SinonStub<any[], any>

    beforeEach(function () {
      canAccessStub = sinon.stub().returns(true)
    })

    context('without args', function () {
      it('should return false', function () {
        // @ts-ignore
        expect(canEditMove()).to.be.false
      })
    })

    context('with move that has left custody', function () {
      const mockMove: Move = moveFactory.build()
      mockMove._hasLeftCustody = true
      it('should return false', function () {
        expect(canEditMove(mockMove, canAccessStub)).to.be.false
      })

      context('with access', function () {
        const mockMove: Move = moveFactory.build()
        mockMove._hasLeftCustody = true
        it('should return false', function () {
          canAccessStub.returns(true)
          expect(canEditMove(mockMove, canAccessStub)).to.be.false
        })
      })
    })

    context('with move that has not left custody', function () {
      let mockMove: Move

      beforeEach(function () {
        mockMove = moveFactory.build({
          _hasLeftCustody: false,
          move_type: 'court_appearance',
        })
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
