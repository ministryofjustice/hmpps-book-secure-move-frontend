const { filter, get, map, reject } = require('lodash')

function confirmation(req, res) {
  const {
    court_hearings: courtHearings,
    move_type: moveType,
    to_location: toLocation,
  } = res.locals.move
  const suppliers = get(res.locals, 'move.from_location.suppliers')
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

  const locals = {
    location:
      moveType === 'prison_recall'
        ? req.t('fields::move_type.items.prison_recall.label')
        : toLocation.title,
    savedHearings,
    supplierNames,
    unsavedHearings,
  }

  res.render('move/views/confirmation', locals)
}

module.exports = confirmation
