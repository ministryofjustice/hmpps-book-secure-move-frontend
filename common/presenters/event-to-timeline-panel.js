const eventHelpers = require('../helpers/events')

const eventToTagComponent = require('./event-to-tag-component')

/* eslint-disable-next-line require-await */
module.exports = async (token, moveEvent, move) => {
  const event = eventHelpers.setEventDetails(moveEvent, move)
  const { id, event_type: eventType, details } = event
  const {
    nature_of_self_harm: natureOfSelfHarm,
    history_of_self_harm_recency: historyOfSelfHarmRecency,
  } = details
  // const description = await eventHelpers.getDescription(token, event)

  const rows = []

  if (eventType === 'PerSuicideAndSelfHarm') {
    natureOfSelfHarm &&
      rows.push([
        {
          heading:
            '<h4 class="govuk-heading-s govuk-!-font-size-16">Concern</h4>',
        },
        {
          html: natureOfSelfHarm
            .map(
              obj =>
                `<p class="govuk-!-font-size-16">${obj.option} - ${obj.details}</p>`
            )
            .join(''),
        },
      ])

    historyOfSelfHarmRecency &&
      rows.push([
        {
          heading:
            '<h4 class="govuk-heading-s govuk-!-font-size-16">History</h4>',
        },
        {
          html: `<time class="govuk-!-font-size-16" datetime="${historyOfSelfHarmRecency}">${historyOfSelfHarmRecency}</time>`,
        },
      ])
  }

  let html = `
    <table class="govuk-table">
      <tbody class="govuk-table__body">
  `
  // Loop through the rows array and add dynamic rows
  rows.forEach(row => {
    const heading = row[0].heading
    const htmlContent = row[1].html

    html += `
      <tr class="govuk-table__row">
        <th scope="row" class="govuk-table__header">${heading}</th>
        <td class="govuk-table__cell">${htmlContent}</td>
      </tr>
    `
  })

  // Close the table tag
  html += `
      </tbody>
    </table>
  `

  // console.log(html)

  const tag = eventToTagComponent(event)
  delete tag.href

  // const formattedDate = filters.formatDateWithTimeAndDay(timestamp)

  return {
    tag,
    html,
    isFocusable: true,
    attributes: { id },
  }
}
