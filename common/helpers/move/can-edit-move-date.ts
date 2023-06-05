import { Move } from '../../types/move'

import { canEditMove } from './can-edit-move'

export function canEditMoveDate(
  move: Move,
  canAccess: (permission: string) => boolean,
  context: string = 'none'
) {
  if (move.is_lodging) {
    return false
  }

  if (move.allocation && context !== 'update_allocation') {
    return false
  }

  return canEditMove(move, canAccess)
}
