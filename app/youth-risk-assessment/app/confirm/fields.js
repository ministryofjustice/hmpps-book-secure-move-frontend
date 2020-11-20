const confirmAssessment = {
  id: 'confirm_assessment',
  name: 'confirm_assessment',
  component: 'govukCheckboxes',
  items: [
    {
      text: 'fields::confirm_youth_risk_assessment.label',
      value: 'yes',
    },
  ],
  validate: 'required',
}

module.exports = {
  confirm_assessment: confirmAssessment,
}
