const { kebabCase, groupBy, mapValues, values } = require('lodash')

const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')

function _mapAnswer(answer) {
  let html = ''

  if (answer.nomis_alert_description) {
    html = `<h4 class="govuk-!-margin-top-0 govuk-!-margin-bottom-2">${answer.nomis_alert_description}</h4>`
  }

  html += answer.comments || ''

  if (answer.created_at) {
    html += `<div class="govuk-!-margin-top-2 govuk-!-font-size-16">${i18n.t(
      'created_on'
    )} ${filters.formatDateWithDay(answer.created_at)}</div>`
  }

  return {
    value: {
      html,
    },
  }
}

module.exports = function assessmentCategoryToPanelListComponent({
  answers,
  key,
  tagClass,
}) {
  const groupedByTitle = groupBy(answers, 'title')
  const panels = mapValues(groupedByTitle, (answers, title) => {
    return {
      attributes: {
        id: kebabCase(title),
      },
      tag: {
        text: title,
        classes: tagClass,
      },
      items: answers.map(_mapAnswer),
    }
  })

  return {
    key,
    panels: values(panels),
  }
}
