const { pick } = require('lodash')

const filters = require('../../common/controllers/filters')
const fieldHelpers = require('../../common/helpers/field')
const presenters = require('../../common/presenters')

module.exports = {
  renderSearchForm: fields => {
    return (req, res) => {
      const { ...queryValues } = req.query
      const values = filters.removeDefaultFilterValues(fields, queryValues)

      // const referrerValues = filters.getReferrerValues(fields, values)
      const defaultValues = filters.getDefaultValues(fields)

      const components = fieldHelpers.processFields(fields, {
        ...defaultValues,
        ...values,
      })

      res.render('search/views/search-form', {
        filters: {
          components,
        },
      })
    }
  },
  renderSearchResults: async (req, res, next) => {
    try {
      const { reference, search_type: searchType } = req.query
      const requiedFilterKeys = [
        'reference',
        'police_national_computer',
        'prison_number',
      ]
      const meetsRequiredFilter = Object.keys(req.query).some(key =>
        requiedFilterKeys.includes(key)
      )
      let results = []

      if (meetsRequiredFilter) {
        if (searchType === 'move') {
          results = await req.services.move.search({
            reference,
          })
        } else if (searchType === 'person') {
          results = await req.services.person
            .getByIdentifiers(
              pick(req.query, ['police_national_computer', 'prison_number'])
            )
            .then(data => {
              return data.map(person => {
                return {
                  profile: {
                    person,
                  },
                }
              })
            })
        }
      }

      const resultsAsTable = presenters.singleRequestsToTableComponent({
        query: req.query,
      })(results)

      res.render('search/views/search-results', {
        results,
        resultsAsTable,
      })
    } catch (error) {
      next(error)
    }
  },
}
