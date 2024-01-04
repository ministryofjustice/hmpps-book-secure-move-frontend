import { expect } from 'chai'

import { AllocationFactory } from '../../../factories/allocation'
import { MoveFactory } from '../../../factories/move'

import { canEditAllocation } from './can-edit-allocation'

describe('#canEditAllocation', function () {
  let allocation = AllocationFactory.build()
  let permissions: string[]

  function canAccessFunction(permissions: string[]) {
    return (permission: string) => permissions.includes(permission)
  }

  beforeEach(function () {
    permissions = [
      'allocation:update',
      'move:update',
      'move:update:prison_transfer',
    ]
  })

  context('when it can be edited', function () {
    it('returns true', function () {
      expect(canEditAllocation(allocation, canAccessFunction(permissions))).to
        .be.true
    })
  })

  context('when the user does not have permission', function () {
    beforeEach(function () {
      permissions = []
    })

    it('returns false', function () {
      expect(canEditAllocation(allocation, canAccessFunction(permissions))).to
        .be.false
    })
  })

  context('when the allocation is cancelled', function () {
    beforeEach(function () {
      allocation = AllocationFactory.build({ status: 'cancelled' })
    })

    it('returns false', function () {
      expect(canEditAllocation(allocation, canAccessFunction(permissions))).to
        .be.false
    })
  })

  context('when the moves count is zero (all moves cancelled)', function () {
    beforeEach(function () {
      allocation = AllocationFactory.build({
        moves: MoveFactory.buildList(2, { status: 'cancelled' }),
        moves_count: 0,
      })
    })

    it('returns false', function () {
      expect(canEditAllocation(allocation, canAccessFunction(permissions))).to
        .be.false
    })
  })

  context('when an associated move cannot be edited', function () {
    beforeEach(function () {
      const moves = [
        MoveFactory.build(),
        MoveFactory.build({ status: 'in_transit' }),
      ]
      allocation = AllocationFactory.build({ moves })
    })

    it('returns false', function () {
      expect(canEditAllocation(allocation, canAccessFunction(permissions))).to
        .be.false
    })
  })

  context('when an associated move is cancelled', function () {
    beforeEach(function () {
      const moves = [
        MoveFactory.build(),
        MoveFactory.build({ status: 'cancelled' }),
      ]
      allocation = AllocationFactory.build({ moves })
    })

    it('returns true', function () {
      expect(canEditAllocation(allocation, canAccessFunction(permissions))).to
        .be.true
    })
  })
})
