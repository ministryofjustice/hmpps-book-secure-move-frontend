function canEditMoveDestination(move = {}, canEditMove = () => false) {
  if (move.is_lodging) {
    return false
  }

  return canEditMove()
}

module.exports = canEditMoveDestination
