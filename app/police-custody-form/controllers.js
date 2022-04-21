exports.addEvents = async function (req, res) {
  const moveId = req.body.moveId
  const lockoutEvents = req.body
  const user = req.user
  const move = await req.services.move.getById(moveId)

  if (lockoutEvents.events === undefined) {
    req.session.showErrorsSummary = true
    return res.redirect(`move/${moveId}/police-custody-form`)
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
    const mappedErrors = mapErrorMessages(errors)

    req.session.showErrorsSummary = true
    req.session.errors = mappedErrors
    req.session.formData = req.body

    return res.redirect(`move/${moveId}/police-custody-form`)
  }

  await req.services.event.postEvents(lockoutEvents, move, user)

  return res.redirect(`move/${moveId}/timeline`)
}

function mapErrorMessages(errors) {
  const mappedErrorsWithMessages = []

  errors.forEach(error => {
    switch (error) {
      case 'PerViolentDangerous':
        mappedErrorsWithMessages.push({
          error: error,
          message: 'Enter details of any violence that has taken place',
        })
        break
      case 'PerWeapons':
        mappedErrorsWithMessages.push({
          error: error,
          message: 'Enter details of weapons created or used',
        })
        break
      case 'PerConcealed':
        mappedErrorsWithMessages.push({
          error: error,
          message: 'Enter details of restricted or concealed items',
        })
        break
      case 'PerSelfHarm':
        mappedErrorsWithMessages.push({
          error: error,
          message: 'Enter details of self-harm or suicide',
        })
        break
      case 'PerEscape':
        mappedErrorsWithMessages.push({
          error: error,
          message: 'Enter details of escape or attempted escape',
        })
        break
      case 'PersonMoveUsedForce':
        mappedErrorsWithMessages.push({
          error: error,
          message: 'Enter details of force used',
        })
        break
      case 'PerMedicalAid1':
        mappedErrorsWithMessages.push({
          error: error,
          message: 'Enter details of medical attention received',
        })
        break
      case 'PerMedicalDrugsAlcohol':
        mappedErrorsWithMessages.push({
          error: error,
          message:
            'Enter details of any signs of drug or alcohol abuse or withdrawal',
        })
        break
      case 'PerMedicalAid2':
        mappedErrorsWithMessages.push({
          error: error,
          message: 'Enter details of any medication given',
        })
        break
      case 'PerMedicalMentalHealth':
        mappedErrorsWithMessages.push({
          error: error,
          message:
            'Enter details of changes in mood, behaviour or signs of mental health issues',
        })
        break
      case 'PerPropertyChange':
        mappedErrorsWithMessages.push({
          error: error,
          message: 'Enter details of property changes',
        })
        break
      case 'PersonMoveDeathInCustody':
        mappedErrorsWithMessages.push({
          error: error,
          message: 'Enter details of death in custody',
        })
        break
      case 'PerGeneric':
        mappedErrorsWithMessages.push({
          error: error,
          message: 'Enter details of any other events',
        })
        break
    }
  })

  return mappedErrorsWithMessages
}
