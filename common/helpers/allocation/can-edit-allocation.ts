import { Allocation } from "../../types/allocation"

const { canEditMoveDate, canEditMove } = require('../../../common/helpers/move')

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

  if (allocation.moves.some(move => !canEditMoveDate(move, canAccess))) {
    return false
  }

  return true
}
