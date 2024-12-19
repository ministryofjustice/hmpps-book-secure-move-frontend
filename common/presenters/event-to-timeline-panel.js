const eventHelpers = require('../helpers/events')

const eventToTagComponent = require('./event-to-tag-component')

/* eslint-disable-next-line require-await */
module.exports = async (token, moveEvent, move) => {
  const event = eventHelpers.setEventDetails(moveEvent, move)
  const { id, event_type: eventType, details } = event
  const {
    nature_of_self_harm: natureOfSelfHarm,
    history_of_self_harm_recency: historyOfSelfHarmRecency,
    history_of_self_harm_method: historyOfSelfHarmMethod,
    history_of_self_harm_details: historyOfSelfHarmDetails,
    actions_of_self_harm_undertaken: actionsOfSelfHarmUndertaken,
    observation_level: observationLevel,
  } = details

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

    // TO DO - Source [Source type]
    // source &&
    rows.push([
      {
        heading: '<h4 class="govuk-heading-s govuk-!-font-size-16">Source</h4>',
      },
      {
        html: `<p class="govuk-!-font-size-16">...</p>`,
      },
    ])

    // TO DO - Source summary [Source summary text]
    // sourceSummary &&
    rows.push([
      {
        heading:
          '<h4 class="govuk-heading-s govuk-!-font-size-16">Source summary</h4>',
      },
      {
        html: `<p class="govuk-!-font-size-16">...</p>`,
      },
    ])

    // TO DO - Source observations  [Source summary text]
    // sourceSummary &&
    rows.push([
      {
        heading:
          '<h4 class="govuk-heading-s govuk-!-font-size-16">Source observations</h4>',
      },
      {
        html: `<p class="govuk-!-font-size-16">...</p>`,
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

    // TO DO - Comments
    // comments &&
    rows.push([
      {
        heading:
          '<h4 class="govuk-heading-s govuk-!-font-size-16">Comments</h4>',
      },
      {
        html: `<p class="govuk-!-font-size-16">...</p>`,
      },
    ])

    // TO DO - Reporting officer
    // reportingOfficer &&
    rows.push([
      {
        heading:
          '<h4 class="govuk-heading-s govuk-!-font-size-16">Reporting officer</h4>',
      },
      {
        html: `<p class="govuk-!-font-size-16">...</p>`,
      },
    ])

    // TO DO - Signed and dated
    // signedAndDated &&
    rows.push([
      {
        heading:
          '<h4 class="govuk-heading-s govuk-!-font-size-16">Signed and dated</h4>',
      },
      {
        html: `<p class="govuk-!-font-size-16">...</p>`,
      },
    ])

    // TO DO - Reception officer
    // ReceptionOfficer &&
    rows.push([
      {
        heading:
          '<h4 class="govuk-heading-s govuk-!-font-size-16">Reception officer</h4>',
      },
      {
        html: `<p class="govuk-!-font-size-16">...</p>`,
      },
    ])

    // TO DO - Reception officer (signed date)
    // ReceptionOfficer &&
    rows.push([
      {
        heading:
          '<h4 class="govuk-heading-s govuk-!-font-size-16">Reception officer</h4>',
      },
      {
        html: `<p class="govuk-!-font-size-16">...</p>`,
      },
    ])

    // TO DO - date
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
      <tr class="govuk-table__row">
        <td class="govuk-!-padding-top-4 govuk-!-font-size-14" style="color: govuk-colour("mid-grey")">Timestamp....</td>
      </tr>
      </tbody>
    </table>
  `

  const tag = eventToTagComponent(event)
  delete tag.href

  return {
    tag,
    html,
    isFocusable: true,
    attributes: { id },
  }
}
