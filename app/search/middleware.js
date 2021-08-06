const presenters = require('../../common/presenters')
const validators = require('../move/validators')

function processSearchTerm(req, res, next) {
  const query = req.query.q
  let queryType

  if (validators.moveReference(query)) {
    queryType = 'move_reference'
  } else if (validators.policeNationalComputerNumber(query)) {
    queryType = 'police_national_computer'
  } else if (validators.prisonNumber(query)) {
    queryType = 'prison_number'
  }

  req.searchQuery = {
    type: queryType,
    value: query,
  }

  next()
}

async function processSearchResults(req, res, next) {
  try {
    const { searchQuery = {} } = req

    if (!searchQuery.type) {
      return next()
    }

    let results
    let resultsPresenter

    switch (searchQuery.type) {
      case 'move_reference':
        results = await req.services.move.search({
          reference: searchQuery.value.toUpperCase(),
        })
        resultsPresenter = 'movesToSearchResultsTable'
        break
      case 'police_national_computer':
        results = await req.services.person.getByIdentifiers({
          police_national_computer: searchQuery.value,
        })
        resultsPresenter = 'peopleToSearchResultsTable'
        break
      case 'prison_number':
        results = await req.services.person.getByIdentifiers({
          prison_number: searchQuery.value,
        })
        resultsPresenter = 'peopleToSearchResultsTable'
        break
    }

    req.searchResults = results

    if (resultsPresenter) {
      req.searchResultsAsTable = presenters[resultsPresenter]()(results)
    }

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  processSearchTerm,
  processSearchResults,
}
