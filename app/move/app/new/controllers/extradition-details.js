const { format: formatDate } = require('date-fns')

const CreateBaseController = require('./base')
const { set } = require('lodash')

class ExtraditionDetailsController extends CreateBaseController {
  middlewareSetup() {
    super.middlewareSetup()
  }

  process(req, res, next) {

    const flight_number = req.body['extradition_flight_number']
    const flight_day = req.body['extradition_flight_date-day']
    const day = req.body['day']

    const flight_month = req.body['extradition_flight_date-month']
    const month = req.body['month']
    const flight_year = req.body['extradition_flight_date-year']
    const year = req.body['year']
    const flight_time = req.form.values['extradition_flight_time']

    //req.form.values.extradition_flight_date =  formatDate(`${flight_year}-${flight_month}-${flight_day}`, 'yyyy-MM-dd')
    console.log(req.form.values)
    //req.form.values.set('extradition_flight_date-year', flight_year)

    console.log(flight_number)
    console.log(flight_day)
    console.log(day)
    console.log(flight_month)
    console.log(month)
    console.log(flight_year)
    console.log(year)
    console.log(flight_time)

      console.log(`${year}-${month}-${day} ${flight_time}`)
      const flight_timestamp = formatDate(`${year}-${month}-${day} ${flight_time}`, 'yyyy-MM-dd HH:mm')
      console.log(flight_timestamp)
      //req.form.values['extradition_flight_date'] = formatDate(`${year}-${month}-${day}`, 'dd MM yyyy')
      req.form.values.extradition_flight_date = {}
      req.form.values.extradition_flight_date.items = []
      req.form.values['extradition_flight_date'].items[0] = formatDate(`${day}`, 'dd')
      req.form.values['extradition_flight_date-day'] = formatDate(`${day}`, 'dd')
      req.form.values['extradition_flight_date'].items[1] = formatDate(`${month}`, 'MM')
      req.form.values['extradition_flight_date-month'] = formatDate(`${month}`, 'MM')
      req.form.values['extradition_flight_date'].items[2] = formatDate(`${year}`, 'yyyy')
      req.form.values['extradition_flight_date-year'] = formatDate(`${year}`, 'yyyy')
      req.form.values.extradition_flight_timestamp = flight_timestamp
      console.log(flight_timestamp)

      console.log(req.form.values)
    next()
  }
  saveValues(req, res, next){
    console.log('form:')
    console.log(req.form.fields)
    console.log('body:')
    console.log(req.body)
    next()
  }
}

module.exports = ExtraditionDetailsController
