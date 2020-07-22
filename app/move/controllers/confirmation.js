const { filter, map, reject } = require('lodash')

function confirmation(req, res) {
  const move = req.move
  const {
    court_hearings: courtHearings,
    move_type: moveType,
    to_location: toLocation,
  } = move
  const { moves: allocationMoves = [] } = req.allocation || {}
  const suppliers = move?.from_location?.suppliers
  const supplierNames =
    suppliers && suppliers.length
      ? map(suppliers, 'name')
      : [req.t('supplier_fallback')]
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

  const locals = {
    move,
    unassignedMoveId,
    supplierNames,
    savedHearings,
    unsavedHearings,
    location:
      moveType === 'prison_recall'
        ? req.t('fields::move_type.items.prison_recall.label')
        : toLocation.title,
  }

  res.render('move/views/confirmation', locals)
}

module.exports = confirmation
