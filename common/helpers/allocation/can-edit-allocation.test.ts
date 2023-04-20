import { expect } from 'chai'

import allocationFactory from '../../../factories/allocation'
import moveFactory from '../../../factories/move'

import { canEditAllocation } from './can-edit-allocation'

describe('#canEditAllocation', function () {
  let allocation = allocationFactory.build()
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
      expect(
        canEditAllocation(allocation, canAccessFunction(permissions))
      ).to.be.true
    })
  })

  context('when the user does not have permission', function () {
    beforeEach(function () {
      permissions = []
    })

    it('returns false', function () {
      expect(
        canEditAllocation(allocation, canAccessFunction(permissions))
      ).to.be.false
    })
  })

  context('when the allocation is cancelled', function () {
    beforeEach(function () {
      allocation = allocationFactory.build({ status: 'cancelled' })
    })

    it('returns false', function () {
      expect(
        canEditAllocation(allocation, canAccessFunction(permissions))
      ).to.be.false
    })
  })

  context('when an associated move cannot be edited', function () {
    beforeEach(function () {
      const moves = [
        moveFactory.build(),
        moveFactory.build({ status: 'in_transit' }),
      ]
      allocation = allocationFactory.build({ moves })
    })

    it('returns false', function () {
      expect(
        canEditAllocation(allocation, canAccessFunction(permissions))
      ).to.be.false
    })
  })
})
