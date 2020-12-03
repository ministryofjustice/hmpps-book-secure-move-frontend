const router = require('express').Router()
const { cloneDeep } = require('lodash')

const mountpath = '/api/moves'

const ids = ['AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA']

const resources = {}
ids.forEach(id => {
  const resource = require(`./data/${id}.json`)

  const timelineEvents = cloneDeep(resource)
  delete timelineEvents.data.relationships.important_events
  const importantEvents = cloneDeep(resource)
  delete importantEvents.data.relationships.timeline_events

  resources[id] = {
    timelineEvents,
    importantEvents,
  }
})

const AAAA = resources['AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA'].importantEvents
const bishopgateMovesImportantEvents = {
  data: [AAAA.data],
  included: AAAA.included,
  meta: {
    pagination: {
      per_page: '100',
      total_pages: 1,
      total_objects: 1,
    },
  },
  links: {
    prev: null,
    next: null,
    last: null,
  },
}
const bishopgateMovesDefault = cloneDeep(bishopgateMovesImportantEvents)
delete bishopgateMovesDefault.data[0].relationships.important_events

const bishopgateMoves = {
  default: bishopgateMovesDefault,
  importantEvents: bishopgateMovesImportantEvents,
}

router.use('/:id', (req, res, next) => {
  const { id } = req.params

  if (resources[id]) {
    const eventsType = req.query.include.includes('timeline_events')
      ? 'timelineEvents'
      : 'importantEvents'
    const data = resources[id][eventsType]
    req.response = { data }
  }

  next()
})

router.use((req, res, next) => {
  if (
    req.query.include &&
    req.query['filter[from_location_id]'] ===
      '0ee995d1-9390-4e85-9f5a-c6a436716234'
  ) {
    const eventsType = req.query.include.includes('important_events')
      ? 'importantEvents'
      : 'default'
    const data = bishopgateMoves[eventsType]
    req.response = { data }
  }

  next()
})

router.use((req, res, next) => {
  if (req.request.params.include) {
    req.request.params.include = req.request.params.include.replace(
      /important_events,/,
      ''
    )
  }

  next()
})

module.exports = {
  router,
  mountpath,
}
