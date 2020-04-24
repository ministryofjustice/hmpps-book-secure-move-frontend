function assessmentAnswer({ isRequired = false, isExplicit = false } = {}) {
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
