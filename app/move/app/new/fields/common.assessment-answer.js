function assessmentAnswer({
  isRequired = false,
  isExplicit = false,
  name,
} = {}) {
  let params = {
    skip: true,
    rows: 3,
    component: 'govukTextarea',
    classes: 'govuk-input--width-20',
    label: {
      text: 'fields::assessment_comment.optional',
      classes: 'govuk-label--s',
    },
  }

  if (isRequired) {
    params = {
      ...params,
      label: {
        text: 'fields::assessment_comment.required',
        classes: 'govuk-label--s',
      },
      validate: 'required',
      id: name,
    }
  }

  if (isExplicit) {
    params = {
      ...params,
      explicit: true,
    }
  }

  return params
}

module.exports = assessmentAnswer
