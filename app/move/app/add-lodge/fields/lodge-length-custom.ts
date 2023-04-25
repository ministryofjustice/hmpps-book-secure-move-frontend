import { number, positive } from '../../../validators'

export const lodgeLengthCustom = {
  validate: ['required', number, positive],
  component: 'govukInput',
  name: 'lodge_length_custom',
  autocomplete: 'off',
  classes: 'govuk-input--width-2',
  hint: {
    text: 'fields::number.hint',
  },
}
