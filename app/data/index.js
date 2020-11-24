// NPM dependencies
const axios = require('axios')
const { subHours, parseISO, differenceInDays } = require('date-fns')
const router = require('express').Router()
const {
  startCase,
  forEach,
  uniq,
  map,
  groupBy,
  flatten,
  mapKeys,
  mapValues,
  sortBy,
  uniqBy,
} = require('lodash')

// Local dependencies
const {
  getCurrentDayAsRange,
  getCurrentMonthAsRange,
} = require('../../common/helpers/date')
const moveService = require('../../common/services/move')
const referenceDataService = require('../../common/services/reference-data')
const { DATAWRAPPER } = require('../../config')
const { formatDate } = require('../../config/nunjucks/filters')

const undefinedDestinationType = 'prison_recall'

function getTypeBreakdown(moves) {
  const movesByOriginType = groupBy(moves, 'from_location.location_type')
  const destinationTypes = uniq(
    map(
      moves,
      dest => dest.to_location?.location_type || undefinedDestinationType
    )
  )

  const dataBreakdown = mapValues(movesByOriginType, items => {
    const types = {}

    destinationTypes.forEach(type => {
      const filteredByDestinationType = items.filter(item => {
        if (type === undefinedDestinationType) {
          return item.to_location?.location_type === undefined
        }

        return item.to_location?.location_type === type
      })

      types[type] = filteredByDestinationType.length
    })

    return types
  })

  let output = ''
  forEach(dataBreakdown, (origin, key) => {
    output += `,From ${startCase(key)}`
  })
  output += '\n'
  forEach(destinationTypes, type => {
    output += `To ${startCase(type)}`
    forEach(dataBreakdown, (origin, key) => {
      output += `,${origin[type]}`
    })
    output += '\n'
  })

  return output
}

function getLocationBreakdown(moves, direction = 'from_location') {
  const movesByOriginType = groupBy(moves, `${direction}.title`)
  const locations = mapValues(movesByOriginType, (items, title) => {
    return {
      title: title === 'undefined' ? 'Prison recall' : title,
      supplier: items[0].supplier.name,
      count: items.length,
    }
  })
  const sorted = sortBy(locations, 'count').reverse()

  let output = 'Rank,Location,Supplier,Number of moves\n'
  forEach(sorted, (location, i) => {
    output += `${i + 1},${location.title},${location.supplier},${
      location.count
    }\n`
  })

  return output
}

function getTimeBreakdown(moves) {
  const destinationTypes = uniq(
    map(moves, dest => dest.from_location?.location_type)
  )
  const filtered = moves.map(move => {
    return {
      pickupType: move.from_location?.location_type,
      hourKey: formatDate(move.created_at, 'H'),
      hourOfDay: formatDate(move.created_at, 'h aaaa'),
    }
  })
  const groupedByTime = groupBy(filtered, 'hourKey')

  for (let index = 0; index < 24; index++) {
    if (!groupedByTime[index]) {
      groupedByTime[index] = []
    }
  }

  const allTimeslots = mapKeys(groupedByTime, (value, key) => {
    const datetime = `2010-10-10T${key.padStart(2, '0')}:00Z`
    const oneHourBack = subHours(parseISO(datetime), 1)
    const startTime = formatDate(oneHourBack, 'h aaaa')
    const endTime = formatDate(datetime, 'h aaaa')
    return `${startTime} to ${endTime}`
  })

  const dataBreakdown = mapValues(allTimeslots, items => {
    const types = {}

    destinationTypes.forEach(type => {
      const filteredByDestinationType = items.filter(item => {
        return item.pickupType === type
      })

      types[type] = filteredByDestinationType.length
    })

    return types
  })

  let output = 'Description'
  forEach(destinationTypes, type => {
    output += `,${startCase(type)}`
  })
  output += '\n'
  forEach(dataBreakdown, (breakdown, time) => {
    output += time
    forEach(breakdown, (count, origin) => {
      output += `,${count}`
    })
    output += '\n'
  })

  return output
}

function getLeadTimeBreakdown(moves) {
  const destinationTypes = uniq(
    map(moves, dest => dest.from_location?.location_type)
  )
  const filtered = moves.map(move => {
    const leftDate = parseISO(move.date)
    const rightDate = parseISO(move.created_at)
    const difference = differenceInDays(leftDate, rightDate)
    const leadTime = Math.ceil(difference / 7) * 7

    return {
      pickupType: move.from_location?.location_type,
      leadTime: leadTime > 28 ? '28+' : leadTime,
    }
  })
  const groupedByTime = groupBy(filtered, 'leadTime')
  const allTimeslots = mapKeys(groupedByTime, (value, key) => key)
  const dataBreakdown = mapValues(allTimeslots, items => {
    const types = {}

    destinationTypes.forEach(type => {
      const filteredByDestinationType = items.filter(item => {
        return item.pickupType === type
      })

      types[type] = filteredByDestinationType.length
    })

    return types
  })

  let output = 'Description'
  forEach(destinationTypes, type => {
    output += `,${startCase(type)}`
  })
  output += '\n'
  forEach(dataBreakdown, (breakdown, time) => {
    switch (time) {
      case '0':
        output += 'Less than 1 day'
        break
      case '28+':
        output += 'More than 28 days'
        break
      default:
        output += `${time} days`
        break
    }

    forEach(breakdown, (count, origin) => {
      output += `,${count}`
    })
    output += '\n'
  })

  return output
}

function getCancellationReasonBreakdown(moves) {
  const destinationTypes = uniq(
    map(moves, dest => dest.from_location?.location_type)
  )
  const filtered = moves.map(move => {
    return {
      pickupType: move.from_location?.location_type,
      reason: move.cancellation_reason,
    }
  })
  const groupedByTime = groupBy(filtered, 'reason')
  const allTimeslots = mapKeys(groupedByTime, (value, key) => key)
  const dataBreakdown = mapValues(allTimeslots, items => {
    const types = {}

    destinationTypes.forEach(type => {
      const filteredByDestinationType = items.filter(item => {
        return item.pickupType === type
      })

      types[type] = filteredByDestinationType.length
    })

    return types
  })

  let output = 'Description'
  forEach(destinationTypes, type => {
    output += `,${startCase(type)}`
  })
  output += '\n'
  forEach(dataBreakdown, (breakdown, reason) => {
    output += startCase(reason)
    forEach(breakdown, (count, origin) => {
      output += `,${count}`
    })
    output += '\n'
  })

  return output
}

function getCancellationPercentageBreakdown(activeMoves, cancelledMoves) {
  const activeByOriginType = groupBy(activeMoves, 'from_location.location_type')
  const cancelledByOriginType = groupBy(
    cancelledMoves,
    'from_location.location_type'
  )
  const pickupTypes = uniq(
    flatten([
      ...map(activeMoves, dest => dest.from_location?.location_type),
      ...map(cancelledMoves, dest => dest.from_location?.location_type),
    ])
  )

  const activeBreakdown = mapValues(activeByOriginType, items => items.length)
  const cancelledBreakdown = mapValues(
    cancelledByOriginType,
    items => items.length
  )

  let output = ''
  forEach(pickupTypes, type => {
    output += `,From ${startCase(type)}`
  })

  output += '\nNon-cancelled'
  forEach(pickupTypes, type => {
    output += `,${activeBreakdown[type] || 0}`
  })

  output += '\nCancelled'
  forEach(pickupTypes, type => {
    output += `,${cancelledBreakdown[type] || 0}`
  })
  output += '\n'

  return output
}

function getFlagBreakdown(moves, type = '') {
  const answers = moves
    .filter(move => move.profile)
    .filter(move => move.from_location.location_type !== 'prison')
    .map(move => {
      return (move.profile?.assessment_answers || [])
        .filter(answer => !answer.imported_from_nomis)
        .map(({ title, key, comments }) => {
          return { title, key, comments }
        })
    })

  const keys = map(uniqBy(flatten(answers), 'title'), 'title')

  const keyMap = {}
  keys.forEach(key => {
    keyMap[key] = {
      with_comments: [],
      without_comments: [],
    }
  })

  flatten(answers)
    .filter(answer => answer.comments)
    .forEach(answer => {
      keyMap[answer.title].with_comments.push(answer)
    })
  flatten(answers)
    .filter(answer => !answer.comments)
    .forEach(answer => {
      keyMap[answer.title].without_comments.push(answer)
    })

  const flagCount = map(keyMap, (m, title) => {
    const total = m.with_comments.length + m.without_comments.length
    const withCount = m.with_comments.length
    const withoutCount = m.without_comments.length
    return {
      title,
      total,
      with_comments: withCount,
      with_comments_perc: Math.round((withCount / total) * 100),
      without_comments: withoutCount,
      without_comments_perc: Math.round((withoutCount / total) * 100),
    }
  })

  return {
    count: moves.length,
    totalFlags: flatten(answers).length,
    rawFlags: keyMap,
    flagCount: sortBy(flagCount, 'with_comments_perc').reverse(),
  }
}

async function updateChart(data, chartId) {
  await Promise.all([
    axios({
      url: `https://api.datawrapper.de/v3/charts/${chartId}/data`,
      method: 'PUT',
      headers: {
        'Content-Type': 'text/csv',
        authorization: `Bearer ${DATAWRAPPER.API_TOKEN}`,
      },
      data,
    }),
    axios({
      url: `https://api.datawrapper.de/v3/charts/${chartId}`,
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${DATAWRAPPER.API_TOKEN}`,
      },
      data: {
        metadata: {
          annotate: {
            // Update with the current date and time
            notes: `Last updated on ${new Date().toLocaleString()}`,
          },
        },
      },
    }),
  ])
  const publishResponse = await axios({
    url: `https://api.datawrapper.de/charts/${chartId}/publish`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${DATAWRAPPER.API_TOKEN}`,
    },
  })

  return publishResponse.data.data.publicUrl
}

// Define routes
router.get('/', (req, res) => {
  res.render('data/views/data-viz')
})

router.get('/refresh', async (req, res, next) => {
  try {
    const moves = await moveService.getActive({
      createdateRange: getCurrentDayAsRange(),
      include: ['to_location', 'from_location', 'supplier'],
    })
    const cancelledMoves = await moveService.getCancelled({
      createdateRange: getCurrentDayAsRange(),
      include: ['from_location'],
    })
    const typeBreakdown = getTypeBreakdown(moves)
    const pickups = getLocationBreakdown(moves)
    const dropoffs = getLocationBreakdown(moves, 'to_location')
    const bookingTimes = getTimeBreakdown(moves)
    const leadTimes = getLeadTimeBreakdown(moves)
    const cancellationReasons = getCancellationReasonBreakdown(cancelledMoves)
    const percentageOfCancellations = getCancellationPercentageBreakdown(
      moves,
      cancelledMoves
    )

    // return res.send({
    //   typeBreakdown,
    //   pickups,
    //   dropoffs,
    //   bookingTimes,
    //   leadTimes,
    //   cancellationReasons,
    //   percentageOfCancellations,
    // })

    await Promise.all([
      updateChart(typeBreakdown, 'YMkvs'),
      updateChart(pickups, 'k3R82'),
      updateChart(dropoffs, 'UMF0k'),
      updateChart(bookingTimes, 'A1NVp'),
      updateChart(leadTimes, 'eHJzI'),
      updateChart(cancellationReasons, '6DxZD'),
      updateChart(percentageOfCancellations, 'ckRbc'),
    ])

    res.redirect('/data')
  } catch (error) {
    next(error)
  }
})

router.get('/flags', async (req, res, next) => {
  try {
    const moves = await moveService.getActive({
      createdateRange: getCurrentDayAsRange(),
    })
    const flagBreakdown = getFlagBreakdown(moves)

    return res.render('data/views/flags', {
      flagBreakdown,
    })
  } catch (error) {
    next(error)
  }
})

router.get('/search', async (req, res, next) => {
  try {
    const result = await axios({
      url: 'https://api.datawrapper.de/v3/charts?search=destination',
      method: 'GET',
      headers: {
        'Content-Type': 'text/csv',
        authorization: `Bearer ${DATAWRAPPER.API_TOKEN}`,
      },
    })
    res.send(result.data.list)
  } catch (error) {
    next(error)
  }
})

router.get('/locations', async (req, res, next) => {
  const locations = await referenceDataService.getLocations()
  res.send(locations.map(location => location.title))
})

// Export
module.exports = {
  router,
  mountpath: '/data',
}
