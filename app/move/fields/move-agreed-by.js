const moveAgreedBy = {
  classes: 'govuk-input--width-20',
  component: 'govukInput',
  dependent: {
    field: 'move_agreed',
    value: 'true',
  },
  id: 'move_agreed_by',
  label: {
    classes: 'govuk-label--s',
    text: 'fields::move_agreed_by.label',
  },
  name: 'move_agreed_by',
  skip: true,
  validate: 'required',
}

module.exports = moveAgreedBy
