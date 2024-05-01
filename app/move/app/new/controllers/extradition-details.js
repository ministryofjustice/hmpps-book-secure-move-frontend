const {
  format,
  startOfToday,
  startOfTomorrow,
  parseISO,
  isValid: isValidDate,
} = require('date-fns')

const filters = require('../../../../../config/nunjucks/filters')

const CreateBaseController = require('./base')

class ExtraditionDetailsController extends CreateBaseController {
  middlewareSetup() {
    super.middlewareSetup()
    this.use(this.setDateType)
  }

  setDateType(req, res, next) {
    const { date_type: dateType } = req.form.options.fields
    const { items } = dateType

    items[0].text = req.t(items[0].text, {
      date: filters.formatDateWithDay(res.locals.TODAY),
    })
    items[1].text = req.t(items[1].text, {
      date: filters.formatDateWithDay(res.locals.TOMORROW),
    })
    next()
  }

  process(req, res, next) {
    const { date_type: dateType } = req.form.values

    // process move date
    let moveDate

    if (dateType === 'custom') {
      moveDate = parseISO(req.form.values.date_custom)
    } else {
      req.form.values.date_custom = ''
      moveDate = dateType === 'today' ? startOfToday() : startOfTomorrow()
    }

    req.form.values.date = isValidDate(moveDate)
      ? format(moveDate, 'yyyy-MM-dd')
      : undefined

    next()
  }
}

module.exports = ExtraditionDetailsController
