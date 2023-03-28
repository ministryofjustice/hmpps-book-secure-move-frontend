<<<<<<< HEAD
import { number, positive } from '../../../validators'

export const lodgeLengthCustom = {
  validate: ['required', number, positive],
=======
export const lodgeLengthCustom = {
  validate: ['required', 'positive'],
>>>>>>> f5133e5c (chore: WIP add lodge form)
  component: 'govukInput',
  name: 'lodge_length_custom',
  autocomplete: 'off',
  classes: 'govuk-input--width-2',
  hint: {
    text: 'fields::number.hint',
  },
}
