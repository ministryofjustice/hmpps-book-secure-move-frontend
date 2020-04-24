function assessmentCheckboxes(name) {
  if (!name) {
    return {}
  }

  return {
    name,
    component: 'govukCheckboxes',
    multiple: true,
    items: [],
    fieldset: {
      legend: {
        text: `fields::${name}.label`,
        classes: 'govuk-visually-hidden govuk-fieldset__legend--m',
      },
    },
    hint: {
      text: `fields::${name}.hint`,
    },
  }
}

module.exports = assessmentCheckboxes
