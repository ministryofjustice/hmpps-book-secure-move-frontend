import { expect } from 'chai'
import sinon from 'sinon'

import { AllocationFactory } from '../../../factories/allocation'
import { MoveFactory } from '../../../factories/move'
import { Move } from '../../types/move'

import { canEditMoveDate } from './can-edit-move-date'

describe('Move date helper', function () {
  describe('#canEditMoveDate', function () {
    let canAccessStub: sinon.SinonStub<any[], any>
    const mockMove: Move = MoveFactory.build()

    beforeEach(function () {
      canAccessStub = sinon.stub().returns(true)
      mockMove.is_lodging = false
      mockMove.allocation = undefined
    })

    context('without access', function () {
      beforeEach(function () {
        canAccessStub.withArgs('move:update').returns(false)
      })

      it('should return false', function () {
        expect(canEditMoveDate(mockMove, canAccessStub)).to.be.false
      })
    })

    context('with access', function () {
      beforeEach(function () {
        canAccessStub.withArgs('move:update').returns(true)
      })

      context('without lodging', function () {
        beforeEach(function () {
          mockMove.is_lodging = false
        })

        it('should return true', function () {
          expect(canEditMoveDate(mockMove, canAccessStub)).to.be.true
        })
      })

      context('with a lodging', function () {
        beforeEach(function () {
          mockMove.is_lodging = true
        })

        it('should return false', function () {
          expect(canEditMoveDate(mockMove, canAccessStub)).to.be.false
        })
      })

      context('when part of an allocation', function () {
        beforeEach(function () {
          mockMove.allocation = AllocationFactory.build()
        })

        it('should return false', function () {
          expect(canEditMoveDate(mockMove, canAccessStub)).to.be.false
        })

        context('when updating via allocation', function () {
          it('should return true', function () {
            expect(
              canEditMoveDate(mockMove, canAccessStub, 'update_allocation')
            ).to.be.true
          })
        })
      })

      context('when not part of an allocation', function () {
        beforeEach(function () {
          mockMove.allocation = undefined
        })

        it('should return true', function () {
          expect(canEditMoveDate(mockMove, canAccessStub)).to.be.true
        })
      })
    })
  })
})
