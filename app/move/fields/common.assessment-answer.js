function assessmentAnswer({ isRequired = false, isExplicit = false } = {}) {
  let params = {
    classes: 'govuk-input--width-20',
    component: 'govukTextarea',
    label: {
      classes: 'govuk-label--s',
      text: 'fields::assessment_comment.optional',
    },
    rows: 3,
    skip: true,
  }

  if (isRequired) {
    params = {
      ...params,
      label: {
        classes: 'govuk-label--s',
        text: 'fields::assessment_comment.required',
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
