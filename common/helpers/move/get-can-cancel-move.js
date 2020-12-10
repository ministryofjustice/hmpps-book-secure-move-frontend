function getCanCancelMove(req) {
  const { move } = req

  const userPermissions = req.session?.user?.permissions

  const canCancelMove =
    (userPermissions.includes('move:cancel') &&
      !move.allocation &&
      (move.status === 'requested' || move.status === 'booked')) ||
    (userPermissions.includes('move:cancel:proposed') &&
      move.status === 'proposed')

  return canCancelMove
}

module.exports = getCanCancelMove
