const validators = require('../../../validators')

const policeNationalComputer = {
  component: 'govukInput',
  label: {
    html: 'fields::police_national_computer.label',
    classes: 'govuk-label--s',
  },
  hint: {
    text: 'fields::police_national_computer.hint',
  },
  id: 'police_national_computer',
  name: 'police_national_computer',
  classes: 'govuk-input--width-10',
  autocomplete: 'off',
  validate: [validators.policeNationalComputerNumber],
}

module.exports = policeNationalComputer
