// @ts-ignore // TODO: convert to ts
import validators from '../../../validators'

export const lodgeLengthCustom = {
  validate: ['required', validators.positive],
  component: 'govukInput',
  name: 'lodge_length_custom',
  autocomplete: 'off',
  classes: 'govuk-input--width-2',
  hint: {
    text: 'fields::number.hint',
  },
}
