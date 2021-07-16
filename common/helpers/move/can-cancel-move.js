function checkCanCancelMove(canAccess, status, allocation) {
  const suitableStatus = ['requested', 'booked'].includes(status)
  return canAccess('move:cancel') && suitableStatus && !allocation
}

function checkCanCancelMoveProposed(canAccess, status) {
  return canAccess('move:cancel:proposed') && status === 'proposed'
}

function canCancelMove(move, canAccess = () => false) {
  const { status, allocation } = move

  if (checkCanCancelMove(canAccess, status, allocation)) {
    return true
  }

  if (checkCanCancelMoveProposed(canAccess, status)) {
    return true
  }

  return false
}

module.exports = canCancelMove
