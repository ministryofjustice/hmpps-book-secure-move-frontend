const { omit } = require('lodash')

const allocationService = require('../../../../common/services/allocation')

const CreateAllocationBaseController = require('./base')

class SaveController extends CreateAllocationBaseController {
  async saveValues(req, res, next) {
    try {
      const prisonerCategoryLabels = [
        'prisoner_female_category',
        'prisoner_male_category',
        'prisoner_youth_female_category',
        'prisoner_youth_male_category',
      ]
      const sessionModel = req.sessionModel.toJSON()
      const data = omit(sessionModel, [
        'csrf-secret',
        'errors',
        'errorValues',
        ...prisonerCategoryLabels,
      ])

      const prisonerCategoryLabel = prisonerCategoryLabels.find(
        it => (sessionModel[it] || '').length > 0
      )

      const allocation = await allocationService.create({
        ...data,
        ...(prisonerCategoryLabel
          ? { prisoner_category: sessionModel[prisonerCategoryLabel] }
          : {}),
        requested_by: req.session.user.fullname,
      })

      req.sessionModel.set('allocation', allocation)

      next()
    } catch (error) {
      next(error)
    }
  }

  async successHandler(req, res, next) {
    const { id } = req.sessionModel.get('allocation')

    try {
      req.journeyModel.reset()
      req.sessionModel.reset()

      res.redirect(`/allocation/${id}/confirmation`)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = SaveController
