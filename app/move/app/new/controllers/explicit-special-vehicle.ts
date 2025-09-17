// @ts-nocheck
// @ts-expect-error TODO: convert to TS
import AssessmentController from '../controllers/assessment'
import { showOnlySpecialVehicleQuestion } from '../../../../../common/helpers/field/auto-answer-special-vehicle'

class ExplicitSpecialVehicleController extends AssessmentController {
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
