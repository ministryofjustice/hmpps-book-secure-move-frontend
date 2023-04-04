const { BaseService } = require('./base')

const defaultInclude = ['from_location', 'to_location']

const noMoveIdMessage = 'No move ID supplied'

class JourneyService extends BaseService {
  defaultInclude() {
    return defaultInclude
  }

  getByMoveId(
    moveId,
    { combinedData = [], page = 1, include = defaultInclude } = {}
  ) {
    if (!moveId) {
      return Promise.reject(new Error(noMoveIdMessage))
    }

    return this.apiClient
      .one('move', moveId)
      .all('journey')
      .get({ include, page })
      .then(response => {
        const { data, links } = response
        const journeys = [...combinedData, ...data]

        const hasNext = links.next && data.length !== 0

        if (!hasNext) {
          return journeys
        }

        return this.getByMoveId(moveId, {
          combinedData: journeys,
          page: page + 1,
          include,
        })
      })
  }
}

module.exports = JourneyService
