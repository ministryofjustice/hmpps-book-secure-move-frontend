function assessmentCheckboxes(name) {
  if (!name) {
    return {}
  }

  return {
    component: 'govukCheckboxes',
    fieldset: {
      legend: {
        classes: 'govuk-visually-hidden govuk-fieldset__legend--m',
        text: `fields::${name}.label`,
      },
    },
    hint: {
      text: `fields::${name}.hint`,
    },
    items: [],
    multiple: true,
    name,
  }
}

module.exports = assessmentCheckboxes
