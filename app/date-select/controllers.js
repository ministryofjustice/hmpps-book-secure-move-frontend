const { format, isValid } = require('date-fns')

const fieldHelpers = require('../../common/helpers/field')
const { dateRegex } = require('../../common/helpers/url')
const parsers = require('../../common/parsers')
const { DATE_FORMATS } = require('../../config/index')

const fields = require('./fields')

const DateRegExp = new RegExp('/' + dateRegex)

const applyDateSelect = (req, res, next) => {
  const { referrer, date_select: dateSelect } = req.body
  const parsedDate = parsers.date(dateSelect)

  if (isValid(parsedDate)) {
    const formattedDate = format(parsedDate, DATE_FORMATS.URL_PARAM)
    const redirectUrl = referrer.replace(DateRegExp, `/${formattedDate}`)

    return res.redirect(redirectUrl)
  }

  let errors = fieldHelpers.setErrors([{ key: 'date_select', type: 'date' }])
  errors = fieldHelpers.addErrorListToErrors(errors, fields)
  req.errors = errors

  req.query = req.body
  next()
}

const renderDateSelectInputs = (req, res, next) => {
  const values = req.query
  const { referrer } = values
  const { errors } = req

  const components = fieldHelpers.processFields(fields, values, errors)

  const cancelUrl = referrer

  res.locals = {
    ...res.locals,
    errors,
    cancelUrl,
    components,
    referrer: {
      url: referrer,
    },
  }

  res.render('date-select/views/date-select.njk')
}

module.exports = {
  applyDateSelect,
  renderDateSelectInputs,
}
