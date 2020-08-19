const filters = require('../controllers/filters')
const { getUrl } = require('../lib/request')
const filtersToCategoriesListComponent = require('../presenters/filters-to-categories-list-component')

const setRequestFilters = (fields, filtersUrl = '/filters') => {
  return (req, res, next) => {
    const pageUrl = req.originalUrl.replace(/\?.*/, '')
    const values = filters.removeDefaultFilterValues(fields, req.query)

    const referrerValues = filters.getReferrerValues(fields, values)

    const filterList = Object.keys(fields)
    const intersection = Object.keys(values).filter(x => filterList.includes(x))
    const hasFilterValues = !![...intersection].length

    const editFilters = getUrl(filtersUrl, {
      ...values,
      referrer: pageUrl,
    })

    const clearFilters = hasFilterValues
      ? getUrl(pageUrl, referrerValues)
      : undefined

    const links = {
      editFilters,
      clearFilters,
    }

    const categories = filtersToCategoriesListComponent(fields, values, pageUrl)

    res.locals.requestFilters = {
      categories,
      links,
    }

    next()
  }
}

module.exports = setRequestFilters
