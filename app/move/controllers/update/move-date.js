const { get, pick } = require('lodash')

const moveService = require('../../../../common/services/move')
const { formatDate } = require('../../../../config/nunjucks/filters')
const CreateMoveDateController = require('../create/move-date')

const UpdateBase = require('./base')

class UpdateMoveDetailsController extends UpdateBase {
  getUpdateValues(req, res) {
    const move = req.getMove()
    if (!move) {
      return {}
    }

    const values = {}
    values.date_type = 'custom'
    const dateFormat = 'yyyy-MM-dd'
    const dates = {
      [formatDate(res.locals.TODAY, dateFormat)]: 'today',
      [formatDate(res.locals.TOMORROW, dateFormat)]: 'tomorrow',
    }
    if (dates[move.date]) {
      values.date_type = dates[move.date]
    }
    if (values.date_type === 'custom') {
      values.date_custom = formatDate(move.date)
    }

    return values
  }

  async saveValues(req, res, next) {
    try {
      const id = req.getMoveId()
      const data = {
        ...pick(get(req, 'form.values'), ['date', 'date_type', 'date_custom']),
        id,
      }

      if (req.getMove().date !== data.date) {
        await moveService.update(data)
      }

      // no need to call super
      next()
    } catch (error) {
      next(error)
    }
  }
}

UpdateBase.mixin(UpdateMoveDetailsController, CreateMoveDateController)

module.exports = UpdateMoveDetailsController
