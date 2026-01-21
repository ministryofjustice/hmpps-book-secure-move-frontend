module.exports = moveEvent => {
  const { id, details } = moveEvent
  const { summary, further_details: furtherDetails } = details

  let html = `<span>${summary.replace(/\r\n|\r|\n/g, '<br/>')}</span>`

  if (furtherDetails) {
    html += `${wrapFurtherDetails(furtherDetails)}`
  }

  return {
    html,
    isFocusable: true,
    attributes: { id },
  }
}

function wrapFurtherDetails(furtherDetails) {
  return `<details class="govuk-details" style="margin-top: 5px; margin-bottom: 5px">
          <summary class="govuk-details__summary">
          <span class="govuk-details__summary-text"> See more details </span>
          </summary>
          <div class="govuk-details__text">
            <p>${furtherDetails.replace(/\r\n|\r|\n/g, '<br/>')}</p>
          </div>
          </details>`
}
