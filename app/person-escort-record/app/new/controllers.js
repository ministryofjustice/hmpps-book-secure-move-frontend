const FormWizardController = require('../../../../common/controllers/form-wizard')
const personEscortRecordService = require('../../../../common/services/person-escort-record')
const i18n = require('../../../../config/i18n')

class NewPersonEscortRecordController extends FormWizardController {
  middlewareLocals() {
    super.middlewareLocals()
    this.use(this.setMoveId)
    this.use(this.setBeforeFieldsContent)
  }

  setMoveId(req, res, next) {
    res.locals.moveId = req.move?.id
    next()
  }

  setBeforeFieldsContent(req, res, next) {
    const locationType = req.move?.from_location?.location_type

    req.form.options.beforeFieldsContent = i18n.t(
      'person-escort-record::create.steps.before_you_start.content',
      {
        context: locationType,
      }
    )

    next()
  }

  async saveValues(req, res, next) {
    try {
      req.record = await personEscortRecordService.create(req.move.profile.id)
      next()
    } catch (err) {
      next(err)
    }
  }

  successHandler(req, res) {
    req.journeyModel.reset()
    req.sessionModel.reset()

    res.redirect(`/person-escort-record/${req.record.id}`)
  }
}

module.exports = {
  NewPersonEscortRecordController,
}
