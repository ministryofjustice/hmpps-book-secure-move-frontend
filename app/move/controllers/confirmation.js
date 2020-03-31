const { get, map } = require('lodash')

function confirmation(req, res) {
  const { move_type: moveType, to_location: toLocation } = res.locals.move
  const suppliers = get(res.locals, 'move.from_location.suppliers')
  const supplierName =
    suppliers && suppliers.length
      ? map(suppliers, 'name').join(' and ')
      : req.t('supplier_fallback')

  const locals = {
    supplierName,
    location:
      moveType === 'prison_recall'
        ? req.t('fields::move_type.items.prison_recall.label')
        : toLocation.title,
  }

  res.render('move/views/confirmation', locals)
}

module.exports = confirmation
