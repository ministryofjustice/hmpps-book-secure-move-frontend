const dateHelpers = require('../../common/helpers/date')
const { DowntimeService } = require('../../common/services/contentful/downtime')
const {
  WhatsNewService,
} = require('../../common/services/contentful/whats-new')
const i18n = require('../../config/i18n').default

async function dashboard(req, res) {
  const currentWeek = dateHelpers.getCurrentWeekAsRange()
  const today = new Date().toISOString()
  let downtimeContent
  let whatsNewContent
  req.session.period = undefined
  req.session.viewDate = undefined

  try {
    downtimeContent = (await new DowntimeService().fetch()).bannerContent
  } catch (e) {
    downtimeContent = null
  }

  if (!downtimeContent) {
    try {
      whatsNewContent = (await new WhatsNewService().fetch()).bannerContent
    } catch (e) {
      whatsNewContent = null
    }
  }

  const numberOfOutgoingMoves = req.filterOutgoing[0].value
  const numberOfIncomingMoves = req.filterIncoming[0].value

  if (numberOfOutgoingMoves !== 1) {
    req.filterOutgoing[0].label = i18n.t(
      'dashboard::sections.outgoing.summary.total_plural'
    )
  }

  if (numberOfIncomingMoves !== 1) {
    req.filterIncoming[0].label = i18n.t(
      'dashboard::sections.incoming.summary.total_plural'
    )
  }

  const sections = {
    outgoing: {
      permission: 'moves:view:outgoing',
      heading: 'dashboard::sections.outgoing.heading',
      filter: req.filterOutgoing,
      period: 'day',
    },
    incoming: {
      permission: 'moves:view:incoming',
      heading: 'dashboard::sections.incoming.heading',
      filter: req.filterIncoming,
      period: 'day',
    },
    singleRequests: {
      permission: 'moves:view:proposed',
      heading: 'dashboard::sections.single_requests.heading',
      filter: req.filterSingleRequests,
      period: 'week',
    },
    allocations: {
      permission: 'allocations:view',
      heading: 'dashboard::sections.allocations.heading',
      filter: req.filterAllocations,
      period: 'week',
    },
  }

  res.render('home/dashboard', {
    pageTitle: 'dashboard::page_title',
    sections,
    currentWeek,
    today,
    downtimeContent,
    whatsNewContent,
  })
}

module.exports = {
  dashboard,
}
