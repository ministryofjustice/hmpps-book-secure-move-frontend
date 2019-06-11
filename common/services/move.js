const apiClient = require('../lib/api-client')

function getMovesByDate (moveDate) {
  return apiClient.findAll('move', {
    'filter[date_from]': moveDate,
    'filter[date_to]': moveDate,
  })
}

function getMoveById (id) {
  return apiClient.find('move', id)
}

module.exports = {
  getMovesByDate,
  getMoveById,
}
