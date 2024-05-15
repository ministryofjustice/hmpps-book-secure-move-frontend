const { format: formatDate, parseISO } = require('date-fns')

const CreateBaseController = require('./base')

class ExtraditionDetailsController extends CreateBaseController {
  middlewareSetup() {
    super.middlewareSetup()
    this.use(this.setDateFields)
  }

  setDateFields(req, res, next) {
    const { extradition_flight_date: extraditionFlightDate } =
      req.form.options.fields
    const { items } = extraditionFlightDate
    items[0].value = this.getErrorOrMoveField(
      req,
      'extradition_flight_date-day'
    )
    items[1].value = this.getErrorOrMoveField(
      req,
      'extradition_flight_date-month'
    )
    items[2].value = this.getErrorOrMoveField(
      req,
      'extradition_flight_date-year'
    )

    next()
  }

  getErrorOrMoveField(req, fieldName) {
    const { errorValues } = req.session[req.sessionModel.options.key]
    return errorValues && fieldName in errorValues
      ? errorValues[fieldName]
      : req.getMove()[fieldName]
  }

  process(req, res, next) {
    const flightNumber = req.form.values.extradition_flight_number
    const day = req.body['extradition_flight_date-day']
    const month = req.body['extradition_flight_date-month']
    const year = req.body['extradition_flight_date-year']
    req.form.values['extradition_flight_date-day'] = day
    req.form.values['extradition_flight_date-month'] = month
    req.form.values['extradition_flight_date-year'] = year
    const flightTime = req.form.values.extradition_flight_time
    let flightDate, flightTimestamp

    try {
      flightDate = formatDate(`${year}-${month}-${day}`, 'yyyy-MM-dd')
      flightTimestamp = parseISO(
        formatDate(`${year}-${month}-${day} ${flightTime}`, 'yyyy-MM-dd HH:mm')
      )
    } catch (e) {}

    req.form.values.extradition_flight_date = flightDate
    req.form.values.extradition_flight_timestamp = flightTimestamp
    req.form.values.extradition_flight = {
      flight_number: flightNumber,
      flight_time: flightTimestamp,
    }

    next()
  }
}

module.exports = ExtraditionDetailsController
