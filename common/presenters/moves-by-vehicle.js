const { isToday, parseISO } = require('date-fns')
const { isEmpty, get, groupBy, orderBy, sortBy } = require('lodash')

const i18n = require('../../config/i18n').default
const filters = require('../../config/nunjucks/filters')
const componentService = require('../services/component')

const moveToCardComponent = require('./move-to-card-component')

module.exports = function movesByVehicle({
  moves,
  context = 'outgoing',
  showLocations = false,
  locationType,
} = {}) {
  const groups = []
  const grouped = groupBy(moves, '_vehicleRegistration')
  const expectedTimeProperty =
    context === 'outgoing' ? '_expectedCollectionTime' : '_expectedArrivalTime'

  Object.entries(grouped).forEach(([group, groupedItems]) => {
    const vehicleRegistration = groupedItems[0]._vehicleRegistration
    const sortedByTime = sortBy(groupedItems, expectedTimeProperty)
    const expectedTime = get(sortedByTime[0], expectedTimeProperty)
    const isComplete = groupedItems.every(
      move => move[context === 'outgoing' ? '_hasLeftCustody' : '_hasArrived']
    )
    const showRelativeTime =
      !isComplete &&
      typeof expectedTime === 'string' &&
      isToday(parseISO(expectedTime))
    const items = sortBy(groupedItems, 'profile.person._fullname').map(
      moveToCardComponent({
        showToLocation: showLocations || context === 'outgoing',
        showFromLocation: showLocations || context === 'incoming',
        locationType,
      })
    )
    const timeData = {
      datetime: expectedTime,
      text: filters.formatTime(expectedTime),
    }
    const timeComponent = componentService.getComponent('appTime', timeData)

    let timeHTML = expectedTime
      ? timeComponent
      : i18n.t('collections::labels.no_expected_time')

    if (showRelativeTime) {
      timeHTML += componentService.getComponent('appTime', {
        ...timeData,
        relative: true,
        displayAsTag: true,
        imminentOffset: 60,
      })
    }

    if (isComplete) {
      timeHTML += componentService.getComponent('govukTag', {
        html: i18n.t('collections::labels.complete', {
          context,
        }),
        classes: 'govuk-tag--green',
      })
    }

    groups.push({
      expectedTime,
      items,
      isComplete,
      hasVehicle: !isEmpty(vehicleRegistration),
      vehicleRegistration,
      header: [
        {
          label: i18n.t('collections::labels.vehicle_registration'),
          value:
            vehicleRegistration ||
            i18n.t('collections::labels.awaiting_vehicle'),
          classes: 'govuk-grid-column-one-quarter',
        },
        {
          label: i18n.t('collections::labels.expected_time', { context }),
          value: timeHTML,
          classes: 'govuk-grid-column-one-half',
        },
        {
          label: i18n.t('people'),
          value: items.length,
          classes: 'govuk-grid-column-one-quarter',
        },
      ],
    })
  })

  return orderBy(
    groups,
    ['isComplete', 'hasVehicle', 'expectedTime', 'vehicleRegistration'],
    ['asc', 'desc', 'asc', 'asc']
  )
}
