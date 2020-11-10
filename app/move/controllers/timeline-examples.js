const getEventsWithLocale = () => {
  const dummy = require('../../../proxies/interceptors/move/data/AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA.json')
  const eventsLocales = require('../../../locales/en/events.json')
  const events = dummy.data.relationships.timeline_events.data
  const included = dummy.included
  return events.map(item => {
    const event = included.filter(resource => resource.id === item.id)[0]
    const { attributes } = event
    const { event_type: type, details = {} } = attributes
    const locale = eventsLocales[type]
    return {
      type,
      details,
      locale,
    }
  })
}

const wrapOutput = (output, baseUrl) => {
  return `
<style>
ul ul a {
  color: black;
  font-size: 0.75em;
}
ul ul li {
  display: inline-block;
}
</style>
<h1>Timeline examples</h1>
<p><a href="${baseUrl}">All events</a></p>
<ul>
  ${output}
</ul>
    `
}

const getEventEnums = (event, detailsKey) => {
  const { locale } = event
  const enumKey = `select_${detailsKey}`

  let enums

  if (locale[enumKey]) {
    enums = Object.keys(locale)
      .filter(key => key.startsWith(`${detailsKey}_`))
      .filter(key => !key.startsWith(`${detailsKey}_comment`))
      .map(key => key.replace(`${detailsKey}_`, ''))

    if (enums.length === 1 && enums[0] === 'true') {
      enums.push('false')
    }
  }

  return enums
}

const getEventEnumsOutput = (event, detailsKey, eventUrl) => {
  let eventEnumsOutput = ''
  const { details } = event

  const enums = getEventEnums(event, detailsKey)

  if (enums) {
    let enumsOutput = ''
    enums.forEach(enumerated => {
      enumsOutput += `<li><a href="${eventUrl}&${detailsKey}=${enumerated}">${enumerated}</a></li>`
    })

    eventEnumsOutput += `<li>${detailsKey}<ul>${enumsOutput}</ul></li>`
  } else {
    const detailsUrl = `${eventUrl}&${detailsKey}=${details[detailsKey]}`
    eventEnumsOutput += `<li><a href="${detailsUrl}">${detailsKey}</a></li>`
  }

  return eventEnumsOutput
}

const getAgencyOutput = (event, eventUrl) => {
  let agencyOutput = ''
  const { locale } = event
  const hasAgency = Object.keys(locale).some(
    key =>
      typeof locale[key] === 'string' && locale[key].includes('select_agency')
  )

  if (hasAgency) {
    agencyOutput += `<li>Event agency<ul><li><a href="${eventUrl}&agency=supplier">by supplier</a></li><li><a href="${eventUrl}&agency=pmu">by PMU</a></li></ul></li>`
  }

  return agencyOutput
}

const getEventOutput = (event, eventUrl) => {
  const { details } = event
  let eventOutput = ''
  Object.keys(details).forEach(detailsKey => {
    eventOutput += getEventEnumsOutput(event, detailsKey, eventUrl)
  })

  eventOutput += getAgencyOutput(event, eventUrl)

  if (eventOutput) {
    eventOutput = `<ul>${eventOutput}</ul>`
  }

  return eventOutput
}

module.exports = async function view(req, res) {
  const eventsWithLocale = getEventsWithLocale()

  const baseUrl = '/move/AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA/timeline'

  let output = ''
  eventsWithLocale.forEach(event => {
    const { type } = event
    const eventUrl = `${baseUrl}?events=${type}`
    const eventOutput = getEventOutput(event, eventUrl)

    output += `<li>
      <a href="${eventUrl}">${type}</a>
      ${eventOutput}
      </li>`
  })

  output = wrapOutput(output, baseUrl)
  res.send(output)
}
