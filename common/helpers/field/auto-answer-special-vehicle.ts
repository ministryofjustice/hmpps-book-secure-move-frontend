// @ts-nocheck
import { omit } from 'lodash'

export default function autoAnswerSpecialVehicle (req) {
  const pregnant = req.questions.find(q => q.key === 'pregnant')
  const wheelchair = req.questions.find(q => q.key === 'wheelchair')
  const specialVehicle = req.questions.find(q => q.key === 'special_vehicle')

  const { health } = req.form.values
  console.log(req.form.values)
  if (health.includes(pregnant.id) || health.includes(wheelchair.id)) {
    req.form.values.special_vehicle__explicit = specialVehicle.id
    req.form.values.special_vehicle = 'Pregnant or wheelchair selected'
    req.sessionModel.special_vehicle_autoselected = true
  } else {
    req.form.options.fields.special_vehicle__explicit.validate = null
    req.form.options.fields.special_vehicle.validate = null
    req.form.values.special_vehicle__explicit = ''
    req.form.values.special_vehicle = ''
  }
  return req
}

export function hideSpecialVehicleQuestion (res) {
  // We want the values for special vehicle to be valid, but don't display the question
  res.locals.options.fields = omit({ ...res.locals.options.fields }, [
    'special_vehicle__explicit',
    'special_vehicle'
  ])
}
