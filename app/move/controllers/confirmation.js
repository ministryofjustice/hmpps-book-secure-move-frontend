const { sendJourneyTime } = require('../../../common/lib/analytics')

async function confirmation(req, res, next) {
  const { move_type: moveType, to_location: toLocation } = res.locals.move

  try {
    await sendJourneyTime(req, 'createMoveJourneyTime', {
      utv: 'Create a move',
    })
  } catch (err) {
    next(err)
  }

  const locals = {
    location:
      moveType === 'prison_recall'
        ? req.t('fields::move_type.items.prison_recall.label')
        : toLocation.title,
  }

  res.render('move/views/confirmation', locals)
}

module.exports = confirmation
