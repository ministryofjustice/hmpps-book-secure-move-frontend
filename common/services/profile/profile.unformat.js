const getAnswer = (profile, field) => {
  const assessments = profile.assessment_answers || []
  return assessments.filter(assessment => {
    return assessment.key === field
  })[0]
}

const mapMethods = {}

mapMethods.explicitAssessment = (profile, field, assessmentCategories) => {
  let value
  const matchedAnswer = getAnswer(profile, field)
  const explicitKey = `${field}__explicit`

  if (matchedAnswer) {
    const questionId = matchedAnswer.assessment_question_id
    value = matchedAnswer.comments
    assessmentCategories[explicitKey] = questionId
  } else {
    assessmentCategories[explicitKey] = 'false'
  }

  return value
}

mapMethods.assessment = (profile, field, assessmentCategories) => {
  let value
  const matchedAnswer = getAnswer(profile, field)

  if (matchedAnswer) {
    const questionId = matchedAnswer.assessment_question_id
    value = matchedAnswer.comments
    const category = matchedAnswer.category
    assessmentCategories[category] = assessmentCategories[category] || []
    assessmentCategories[category].push(questionId)
  }

  return value
}

mapMethods.value = (profile, field) => profile[field]

const mapKeys = Object.keys(mapMethods)

const unformat = (profile, fields = [], fieldKeys = {}) => {
  const assessmentCategories = {}

  const fieldData = fields.map(field => {
    const method =
      mapKeys.filter(
        key => fieldKeys[key] && fieldKeys[key].includes(field)
      )[0] || 'value'
    const value = mapMethods[method](profile, field, assessmentCategories)
    return { [field]: value }
  })
  return Object.assign({}, ...fieldData, assessmentCategories)
}

module.exports = unformat
