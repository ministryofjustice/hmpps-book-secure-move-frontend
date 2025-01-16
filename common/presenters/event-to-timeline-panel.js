const filters = require('../../config/nunjucks/filters')
const eventHelpers = require('../helpers/events')

const eventToTagComponent = require('./event-to-tag-component')

module.exports = async (
  token,
  moveEvent,
  move,
  displayFormattedDate = true
) => {
  const event = eventHelpers.setEventDetails(moveEvent, move)
  const { id, event_type: eventType, details, occurred_at: timestamp } = event
  const {
    nature_of_self_harm: natureOfSelfHarm,
    history_of_self_harm_recency: historyOfSelfHarmRecency,
    history_of_self_harm_method: historyOfSelfHarmMethod,
    history_of_self_harm_details: historyOfSelfHarmDetails,
    actions_of_self_harm_undertaken: actionsOfSelfHarmUndertaken,
    observation_level: observationLevel,
    comments,
    reporting_officer: reportingOfficer,
    reporting_officer_signed_at: reportingOfficerSignedAt,
    reception_officer: receptionOfficer,
    reception_officer_signed_at: receptionOfficerSignedAt,
  } = details
  const description = await eventHelpers.getDescription(token, event)
  const rows = []
  const formattedDate = filters.formatDateWithTimeAndDay(timestamp)
  let html

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

    historyOfSelfHarmMethod &&
      historyOfSelfHarmDetails &&
      rows.push([
        {
          heading:
            '<h4 class="govuk-heading-s govuk-!-font-size-16">Method</h4>',
        },
        {
          html: `<p class="govuk-!-font-size-16">${historyOfSelfHarmMethod} - ${historyOfSelfHarmDetails}</p>`,
        },
      ])

    actionsOfSelfHarmUndertaken &&
      rows.push([
        {
          heading:
            '<h4 class="govuk-heading-s govuk-!-font-size-16">Safety actions</h4>',
        },
        {
          html: actionsOfSelfHarmUndertaken
            .map(
              obj =>
                `<p class="govuk-!-font-size-16">${obj.option} - ${obj.details}</p>`
            )
            .join(''),
        },
      ])

    observationLevel &&
      rows.push([
        {
          heading:
            '<h4 class="govuk-heading-s govuk-!-font-size-16">Observation level</h4>',
        },
        {
          html: `<p class="govuk-!-font-size-16">${observationLevel.option} - ${observationLevel.details}</p>`,
        },
      ])

    comments &&
      rows.push([
        {
          heading:
            '<h4 class="govuk-heading-s govuk-!-font-size-16">Comments</h4>',
        },
        {
          html: `<p class="govuk-!-font-size-16">${comments}</p>`,
        },
      ])

    reportingOfficer &&
      rows.push([
        {
          heading:
            '<h4 class="govuk-heading-s govuk-!-font-size-16">Reporting officer</h4>',
        },
        {
          html: `<p class="govuk-!-font-size-16">${reportingOfficer}</p>`,
        },
      ])

    reportingOfficerSignedAt &&
      rows.push([
        {
          heading:
            '<h4 class="govuk-heading-s govuk-!-font-size-16">Signed and dated</h4>',
        },
        {
          html: `<p class="govuk-!-font-size-16">${reportingOfficerSignedAt}</p>`,
        },
      ])

    receptionOfficer &&
      rows.push([
        {
          heading:
            '<h4 class="govuk-heading-s govuk-!-font-size-16">Reception officer</h4>',
        },
        {
          html: `<p class="govuk-!-font-size-16">${receptionOfficer}</p>`,
        },
      ])

    receptionOfficerSignedAt &&
      rows.push([
        {
          heading:
            '<h4 class="govuk-heading-s govuk-!-font-size-16">Signed and dated</h4>',
        },
        {
          html: `<p class="govuk-!-font-size-16">${receptionOfficerSignedAt}</p>`,
        },
      ])
  }

  html = `<table class="govuk-table"><tbody class="govuk-table__body">`

  if (eventType === 'PerSuicideAndSelfHarm') {
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
  } else {
    html += `<div class="app-timeline__description">${description}</div>`
  }

  // Close the table tag
  html += `</tbody></table>`

  if (displayFormattedDate) {
    html += `<p><time datetime="{{ formattedDate }}" class="app-timeline__date govuk-!-width-full">${formattedDate}</time></p>`
  }

  const tag = eventToTagComponent(event)
  delete tag.href

  return {
    tag,
    html,
    isFocusable: true,
    attributes: { id },
  }
}
