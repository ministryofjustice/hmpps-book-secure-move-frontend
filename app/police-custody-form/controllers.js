exports.addEvents = async function (req, res) {
  const moveId = req.body.moveId
  const lockoutEvents = req.body
  const user = req.user
  const move = await req.services.move.getById(moveId)

  if (lockoutEvents.events === undefined) {
    // Raise error that an event must be selected
  }

  const submittedLockoutEvents = []
  const errors = []

  submittedLockoutEvents.push(lockoutEvents.events)

  submittedLockoutEvents.flat().forEach(event => {
    if (lockoutEvents[event] === '') {
      errors.push(event)
    }
  })

  if (errors.length > 0) {
    req.session.errors = errors
    return res.redirect(`move/${moveId}/police-custody-form`)
  }

  await req.services.event.postEvents(lockoutEvents, move, user)

  delete req.session.errors
  return res.redirect(`move/${moveId}/timeline`)
}
