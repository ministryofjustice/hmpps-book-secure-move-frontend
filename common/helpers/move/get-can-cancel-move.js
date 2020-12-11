function checkCanCancelMove(permissions, status, allocation) {
  if (permissions.includes('move:cancel')) {
    if (['requested', 'booked'].includes(status)) {
      if (!allocation) {
        return true
      }
    }
  }

  return false
}

function checkCanCancelMoveProposed(permissions, status, allocation) {
  if (permissions.includes('move:cancel:proposed')) {
    if (status === 'proposed') {
      return true
    }
  }

  return false
}

function getCanCancelMove(move, permissions = []) {
  const { status, allocation } = move

  if (checkCanCancelMove(permissions, status, allocation)) {
    return true
  }

  if (checkCanCancelMoveProposed(permissions, status)) {
    return true
  }

  return false
}

module.exports = getCanCancelMove
