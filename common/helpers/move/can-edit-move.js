function canEditMove(move = {}, canAccess = () => false) {
  if (move._hasLeftCustody) {
    return false
  }

  if (!canAccess('move:update')) {
    return false
  }

  if (!canAccess(`move:update:${move.move_type}`)) {
    return false
  }

  return true
}

module.exports = canEditMove
