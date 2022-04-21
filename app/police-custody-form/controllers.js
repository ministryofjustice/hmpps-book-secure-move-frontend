const EVENT_ERROR_MESSAGES = {
  PerViolentDangerous: 'Enter details of any violence that has taken place',
  PerWeapons: 'Enter details of weapons created or used',
  PerConcealed: 'Enter details of restricted or concealed items',
  PerSelfHarm: 'Enter details of self-harm or suicide',
  PerEscape: 'Enter details of escape or attempted escape',
  PersonMoveUsedForce: 'Enter details of force used',
  PerMedicalAid1: 'Enter details of medical attention received',
  PerMedicalDrugsAlcohol:
    'Enter details of any signs of drug or alcohol abuse or withdrawal',
  PerMedicalAid2: 'Enter details of any medication given',
  PerMedicalMentalHealth:
    'Enter details of changes in mood, behaviour or signs of mental health issues',
  PerPropertyChange: 'Enter details of property changes',
  PersonMoveDeathInCustody: 'Enter details of death in custody',
  PerGeneric: 'Enter details of any other events',
}

exports.addEvents = async function (req, res) {
  const moveId = req.body.moveId
  const lockoutEvents = req.body
  const user = req.user
  const move = await req.services.move.getById(moveId)

  const errors = (lockoutEvents.events || []).filter(
    e => lockoutEvents[e] === ''
  )

  if (lockoutEvents.events === undefined || errors.length > 0) {
    const mappedErrors = mapErrorMessages(errors)
    req.session.showErrorsSummary = true

    if (errors.length > 0) {
      req.session.errors = mappedErrors
      req.session.formData = req.body
    }

    return res.redirect(`move/${moveId}/police-custody-form`)
  }

  await req.services.event.postEvents(lockoutEvents, move, user)

  return res.redirect(`move/${moveId}/timeline`)
}

function mapErrorMessages(errors) {
  return errors
    .map(error => ({ error, message: EVENT_ERROR_MESSAGES[error] }))
    .filter(e => e.message)
}
