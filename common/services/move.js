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

function createMove (data) {
  return apiClient.create('move', data)
}

module.exports = {
  getMovesByDate,
  getMoveById,
  createMove,
}
