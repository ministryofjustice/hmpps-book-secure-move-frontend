const i18n = require('../../config/i18n')

exports.addEvents = async function (req, res) {
  const lockoutEvents = req.body
  const user = req.user
  const move = req.move
  const moveId = req.move.id
  const journeys = req.journeys

  const errors = [lockoutEvents.events || []]
    .flat()
    .filter(e => lockoutEvents[e] === '')

  if (lockoutEvents.events === undefined || errors.length > 0) {
    const mappedErrors = mapErrorMessages(errors)
    res.locals.showErrorsSummary = true

    if (errors.length > 0) {
      res.locals.formErrors = mappedErrors
      res.locals.formData = req.body
    }

    return res.render('police-custody-form/police-custody-form')
  }

  await req.services.event.postEvents(lockoutEvents, move, journeys, user)

  return res.redirect(`/move/${moveId}/timeline`)
}

function mapErrorMessages(errors) {
  return errors.map(error => ({
    error,
    message: i18n.t(`police-custody-form-errors::${error}`),
  }))
}
