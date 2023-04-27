import { Move } from '../../types/move'

export function canEditMove(
  move: Move,
  canAccess: (permission: string) => boolean
) {
  if (move === undefined || move._hasLeftCustody || !canAccess('move:update')) {
    return false
  }

  return canAccess(`move:update:${move.move_type}`)
}
