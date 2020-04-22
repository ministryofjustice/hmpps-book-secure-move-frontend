const moveAgreedBy = {
  id: 'move_agreed_by',
  name: 'move_agreed_by',
  skip: true,
  component: 'govukInput',
  classes: 'govuk-input--width-20',
  label: {
    text: 'fields::move_agreed_by.label',
    classes: 'govuk-label--s',
  },
  validate: 'required',
  dependent: {
    field: 'move_agreed',
    value: 'yes',
  },
}

module.exports = moveAgreedBy
