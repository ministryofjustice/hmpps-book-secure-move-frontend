const { format } = require('date-fns')
const { isNil } = require('lodash')

const i18n = require('../../../config/i18n').default

const freeSpacesCellData = {
  url: ({ population, date, locationId }) =>
    `/population/day/${format(date, 'yyyy-MM-dd')}/${locationId}${
      isNil(population?.free_spaces) ? '/edit' : ''
    }`,
  content: ({ population }) => {
    if (isNil(population?.free_spaces)) {
      return i18n.t('population::add_space')
    }

    return i18n.t('population::spaces_with_count', {
      count: population.free_spaces,
    })
  },
}

const transfersInCellData = {
  url: ({ population, date, locationId }) => {
    return isNil(population?.transfers_in) || population.transfers_in === 0
      ? ''
      : `/moves/day/${format(
          date,
          'yyyy-MM-dd'
        )}/${locationId}/incoming?status=active&group_by=location`
  },
  content: ({ population }) => {
    if (isNil(population?.transfers_in) || population.transfers_in === 0) {
      return i18n.t('population::no_transfers')
    }

    return i18n.t('population::transfers_in_with_count', {
      count: population.transfers_in,
    })
  },
}

const transfersOutCellData = {
  url: ({ population, date, locationId }) => {
    return isNil(population?.transfers_out) || population.transfers_out === 0
      ? ''
      : `/moves/day/${format(
          date,
          'yyyy-MM-dd'
        )}/${locationId}/outgoing?status=active&group_by=location`
  },
  content: ({ population }) => {
    if (isNil(population?.transfers_out) || population.transfers_out === 0) {
      return i18n.t('population::no_transfers')
    }

    return i18n.t('population::transfers_out_with_count', {
      count: population.transfers_out,
    })
  },
}

const establishmentCellData = {
  url: ({ date, data }) => {
    return `/population/week/${format(date, 'yyyy-MM-dd')}/${data.id}`
  },
  content: ({ data }) => {
    return data.title
  },
}

module.exports = {
  establishmentCellData,
  freeSpacesCellData,
  transfersInCellData,
  transfersOutCellData,
}
