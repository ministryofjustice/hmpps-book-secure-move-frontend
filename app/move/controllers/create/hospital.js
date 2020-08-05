const { formatISO, isValid, parseISO } = require('date-fns')

const filters = require('../../../../config/nunjucks/filters')

const CreateBaseController = require('./base')

class HospitalAppointmentController extends CreateBaseController {
  process(req, res, next) {
    const startTime = req.form.values.time_due

    if (startTime) {
      const moveDate = req.getMove().date
      const moveDateTime = parseISO(`${moveDate}T${startTime}`)
      req.form.values.time_due = isValid(moveDateTime)
        ? formatISO(moveDateTime)
        : startTime
    }

    next()
  }

  getValues(req, res, callback) {
    super.getValues(req, res, (err, values) => {
      if (err) {
        return callback(err)
      }

      if (this.getUpdateValues) {
        values = this.getUpdateValues(req, res, values)
      }

      const updatedValues = {
        ...values,
        time_due: filters.formatTime(values.time_due),
      }

      callback(null, updatedValues)
    })
  }
}

module.exports = HospitalAppointmentController
