function checkCanCancelMove(canAccess, status, allocation) {
  if (canAccess('move:cancel')) {
    if (['requested', 'booked'].includes(status)) {
      if (!allocation) {
        return true
      }
    }
  }

  return false
}

function checkCanCancelMoveProposed(canAccess, status) {
  if (canAccess('move:cancel:proposed')) {
    if (status === 'proposed') {
      return true
    }
  }

  return false
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
