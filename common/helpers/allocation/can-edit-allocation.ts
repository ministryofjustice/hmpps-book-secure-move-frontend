import { Allocation } from "../../types/allocation"

const canEditMove = require('../../../common/helpers/move/can-edit-move')

export function canEditAllocation(allocation: Allocation, canAccess: (permission: string) => boolean): boolean {
  if (!canAccess('allocation:update')) {
    return false
  }

  if (allocation.status === 'cancelled') {
    return false
  }

  if (allocation.moves.some(move => !canEditMove(move, canAccess))) {
    return false
  }

  return true
}