const componentService = require('../../common/services/component')
const i18n = require('../../config/i18n').default
const filters = require('../../config/nunjucks/filters')

const assessmentAnswersToMetaListComponent = require('./assessment-answers-to-meta-list-component')

function frameworkNomisMappingsToPanel({
  heading,
  updatedAt,
  mappings = [],
} = {}) {
  let html = ''

  if (heading) {
    html += `
      <h4 class="govuk-!-font-size-19 govuk-!-font-weight-regular govuk-!-margin-top-3 govuk-!-padding-top-0 govuk-!-margin-bottom-1">
        ${heading}
      </h4>
    `
  }

  if (updatedAt) {
    html += `
      <div class="govuk-caption-s govuk-!-margin-top-0 govuk-!-margin-bottom-2 govuk-!-font-size-16">
        ${i18n.t('last_updated_at', {
          date: filters.formatDateWithRelativeDay(updatedAt),
          time: filters.formatTime(updatedAt),
        })}
      </div>
    `
  }

  if (mappings.length > 0) {
    const metaList = assessmentAnswersToMetaListComponent(mappings)
    const panel = componentService.getComponent('appPanel', {
      classes: 'govuk-!-margin-bottom-4',
      html: componentService.getComponent('appMetaList', metaList),
    })
    html += panel
  }

  return html
}

module.exports = frameworkNomisMappingsToPanel
