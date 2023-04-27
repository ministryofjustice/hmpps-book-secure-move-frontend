import { Allocation } from '../../types/allocation'

const { canEditMoveDate, canEditMove } = require('../../../common/helpers/move')

export function canEditAllocation(
  allocation: Allocation,
  canAccess: (permission: string) => boolean
): boolean {
  if (
    !canAccess('allocation:update') ||
    allocation.status === 'cancelled' ||
    allocation.moves.some(move => !canEditMove(move, canAccess))
  ) {
    return false
  }

  return !allocation.moves.some(move => !canEditMoveDate(move, canAccess))
}
