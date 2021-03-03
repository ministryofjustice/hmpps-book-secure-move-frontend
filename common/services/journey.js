const BaseService = require('./base')

const defaultInclude = ['from_location', 'to_location']

const noMoveIdMessage = 'No move ID supplied'
const noJourneyIdMessage = 'No journey ID supplied'

class JourneyService extends BaseService {
  defaultInclude() {
    return defaultInclude
  }

  getAll({
    moveId,
    combinedData = [],
    page = 1,
    isAggregation = false,
    include,
  } = {}) {
    if (!moveId) {
      return Promise.reject(new Error(noMoveIdMessage))
    }

    return this.apiClient
      .one('move', moveId)
      .all('journey')
      .get()
      .then(response => {
        const { data, links, meta } = response
        const journeys = [...combinedData, ...data]

        if (isAggregation) {
          return meta.pagination.total_objects
        }

        const hasNext = links.next && data.length !== 0

        if (!hasNext) {
          return journeys
        }

        return this.getAll({
          moveId,
          combinedData: journeys,
          page: page + 1,
          include,
        })
      })
  }

  _getById(id, options = {}) {
    if (!id) {
      return Promise.reject(new Error(noJourneyIdMessage))
    }

    return this.apiClient
      .find('journey', id, options)
      .then(response => response.data)
  }

  getById(id) {
    return this._getById(id, {
      include: [...this.defaultInclude()],
    })
  }
}

module.exports = JourneyService
