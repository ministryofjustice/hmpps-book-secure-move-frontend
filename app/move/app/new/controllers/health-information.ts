import addNegativeOption from '../../../../../common/helpers/field/add-negative-option'
// @ts-expect-error TODO: convert to TS
import AssessmentController from '../controllers/assessment'
import { omit } from 'lodash'

class HealthInformationController extends AssessmentController {
  processFields(fields: Record<string, any>) {
    return addNegativeOption(
      fields,
      'health',
      'No, their health doesn’t affect transport',
      'Select if this person’s health affects transport',
    )
  }

  //@ts-ignore
  process(req, res, next) {
    // @ts-ignore
    const pregnant = req.questions.find(q => q.key === 'pregnant')
    // @ts-ignore
    const wheelchair = req.questions.find(q => q.key === 'wheelchair')
    // @ts-ignore
    const special_vehicle = req.questions.find(q => q.key === 'special_vehicle')

    const { health } = req.form.values

    if (health.includes(pregnant.id) || health.includes(wheelchair.id)) {
      req.form.values.special_vehicle__explicit = special_vehicle.id
      req.form.values.special_vehicle = 'Pregnant or wheelchair selected'
    } else {
      req.form.options.fields.special_vehicle__explicit.validate = null
      req.form.options.fields.special_vehicle.validate = null
      req.form.values.special_vehicle__explicit = ''
      req.form.values.special_vehicle = ''
    }
    super.process(req, res, next)
  }

  // @ts-ignore
  render(req, res){
    // We want the values for special vehicle to be valid, but don't display the question
    res.locals.options.fields = omit({ ...res.locals.options.fields }, ['special_vehicle__explicit', 'special_vehicle'])

    super.render(req, res)
  }


}
export default HealthInformationController
