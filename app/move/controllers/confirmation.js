function confirmation(req, res) {
  const { move_type: moveType, to_location: toLocation } = res.locals.move

  const locals = {
    location:
      moveType === 'prison_recall'
        ? req.t('fields::move_type.items.prison_recall.label')
        : toLocation.title,
  }

  res.render('move/views/confirmation', locals)
}

module.exports = confirmation
