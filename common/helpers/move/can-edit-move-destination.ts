import { Move } from '../../types/move'

import { canEditMove } from './can-edit-move'

export function canEditMoveDestination(
  move: Move,
  canAccess: (permission: string) => boolean
) {
  if (move.is_lodging) {
    return false
  }

  return canEditMove(move, canAccess)
}
