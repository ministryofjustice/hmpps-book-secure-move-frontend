const { filter, map, reject } = require('lodash')

function confirmation(req, res) {
  const move = req.move
  const {
    court_hearings: courtHearings,
    move_type: moveType,
    to_location: toLocation,
  } = move
  const { moves: allocationMoves = [] } = req.allocation || {}
  const savedHearings = map(
    filter(courtHearings, 'saved_to_nomis'),
    'case_number'
  )
  const unsavedHearings = map(
    reject(courtHearings, 'saved_to_nomis'),
    'case_number'
  )
  const unassignedMoves = allocationMoves.filter(move => !move.profile)
  const unassignedMoveId =
    unassignedMoves.length !== 0 ? unassignedMoves[0].id : undefined

  const useLabelForLocationTitle = ['prison_recall', 'video_remand']

  const locals = {
    move,
    unassignedMoveId,
    savedHearings,
    unsavedHearings,
    location: useLabelForLocationTitle.includes(moveType)
      ? req.t(`fields::move_type.items.${moveType}.label`)
      : toLocation.title,
  }

  res.render('move/views/confirmation', locals)
}

module.exports = confirmation
