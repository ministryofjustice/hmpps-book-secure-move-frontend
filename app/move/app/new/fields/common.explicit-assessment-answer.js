function explicitAssessmentAnswer({ name, value, conditional } = {}) {
  if (!name || !value || !conditional) {
    return {}
  }

  return {
    id: name,
    name,
    validate: 'required',
    component: 'govukRadios',
    fieldset: {
      legend: {
        text: `fields::${name}.label`,
        classes: 'govuk-fieldset__legend--m',
      },
    },
    hint: {
      text: `fields::${name}.hint`,
    },
    items: [
      {
        value,
        conditional,
        text: 'Yes',
      },
      {
        value: 'false',
        text: 'No',
      },
    ],
  }
}

module.exports = explicitAssessmentAnswer
