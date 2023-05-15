import { Move } from '../../types/move'

export function canEditMove(
  move: Move,
  canAccess: (permission: string) => boolean
) {
  if (move === undefined) {
    return false
  }

  if (move._hasLeftCustody) {
    return false
  }

  if (!canAccess('move:update')) {
    return false
  }

  return canAccess(`move:update:${move.move_type}`)
}
