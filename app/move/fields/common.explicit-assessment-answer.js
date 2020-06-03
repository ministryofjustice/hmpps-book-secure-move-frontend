function explicitAssessmentAnswer({ name, value, conditional } = {}) {
  if (!name || !value || !conditional) {
    return {}
  }

  return {
    component: 'govukRadios',
    fieldset: {
      legend: {
        classes: 'govuk-fieldset__legend--m',
        text: `fields::${name}.label`,
      },
    },
    hint: {
      text: `fields::${name}.hint`,
    },
    items: [
      {
        conditional,
        text: 'Yes',
        value,
      },
      {
        text: 'No',
        value: 'false',
      },
    ],
    name,
    validate: 'required',
  }
}

module.exports = explicitAssessmentAnswer
