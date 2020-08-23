const filters = require('../../common/controllers/filters')
const fieldHelpers = require('../../common/helpers/field')
const request = require('../../common/lib/request')

const applyFilters = fields => {
  return (req, res, next) => {
    const { referrer, ...bodyValues } = req.body
    const values = filters.removeDefaultFilterValues(fields, bodyValues)

    return res.redirect(request.getUrl(referrer, values))
  }
}

const setFiltersInputs = fields => {
  return (req, res, next) => {
    const { referrer, ...queryValues } = req.query
    const values = filters.removeDefaultFilterValues(fields, queryValues)

    const referrerValues = filters.getReferrerValues(fields, values)
    const defaultValues = filters.getDefaultValues(fields)

    const components = fieldHelpers.processFields(fields, {
      ...defaultValues,
      ...values,
    })

    const cancelUrl = request.getUrl(referrer, values)

    res.locals = {
      ...res.locals,
      cancelUrl,
      filters: {
        components,
        referrer: {
          url: referrer,
          values: referrerValues,
        },
      },
    }

    next()
  }
}

const renderFiltersInputs = (req, res) => {
  res.render('filters/views/filters.njk')
}

module.exports = {
  applyFilters,
  setFiltersInputs,
  renderFiltersInputs,
}
