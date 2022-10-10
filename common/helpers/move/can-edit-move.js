function canEditMove(move = {}, canAccess = () => false) {
  if (move._hasLeftCustody) {
    return false
  }

  if (!(canAccess('move:update_date') || canAccess('move:update_details'))) {
    return false
  }

  if (!canAccess(`move:update:${move.move_type}`)) {
    return false
  }

  return true
}

module.exports = canEditMove
