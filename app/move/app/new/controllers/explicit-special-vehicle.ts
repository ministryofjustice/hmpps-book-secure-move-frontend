// @ts-nocheck
// @ts-expect-error TODO: convert to TS
import AssessmentController from '../controllers/assessment'
import { showOnlySpecialVehicleQuestion } from '../../../../../common/helpers/field/auto-answer-special-vehicle'
import addNegativeOption from '../../../../../common/helpers/field/add-negative-option'

class ExplicitSpecialVehicleController extends AssessmentController {
  processFields(fields: Record<string, any>) {
    return addNegativeOption(
      fields,
      'health',
      'No, their health doesn’t affect transport',
      'Select if this person’s health affects transport',
    )
  }
  // @ts-ignore
  render (req, res) {
    showOnlySpecialVehicleQuestion(res)
    super.render(req, res)
  }

  process (req, res, next) {
    const { assessmentCategory } = req.form.options
    const pageOneValues = req.sessionModel.get(`${assessmentCategory}-form`)

    // eslint-disable-next-line camelcase
    const { special_vehicle, special_vehicle__explicit } = req.form.values
    // eslint-disable-next-line camelcase
    pageOneValues.special_vehicle = special_vehicle
    // eslint-disable-next-line camelcase
    pageOneValues.special_vehicle__explicit = special_vehicle__explicit

    req.form.values = pageOneValues
    next()
  }
}
export default ExplicitSpecialVehicleController
