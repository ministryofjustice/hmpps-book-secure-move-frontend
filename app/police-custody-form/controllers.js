const i18n = require('../../config/i18n').default

exports.addEvents = async function (req, res) {
  const { user, move, journeys } = req
  const lockoutEvents = req.body
  const moveId = move.id

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

    delete res.breadcrumb
    return res.render('police-custody-form/police-custody-form')
  }

  await req.services.event.postEvents(req, lockoutEvents, move, journeys, user)

  const fullName = move.profile.person._fullname

  req.flash('success', {
    title: req.t('messages::events_added.heading', {
      type: move.is_lockout ? 'Lockout' : 'Overnight lodge',
    }),
    content: req.t('messages::events_added.content', {
      fullName,
      type: move.is_lockout ? 'lockout' : 'overnight lodge',
    }),
  })

  return res.redirect(`/move/${moveId}`)
}

function mapErrorMessages(errors) {
  return errors.map(error => ({
    error,
    message: i18n.t(`police-custody-form-errors::${error}`),
  }))
}
