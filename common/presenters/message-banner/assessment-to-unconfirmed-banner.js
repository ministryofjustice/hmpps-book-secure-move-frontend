const i18n = require('../../../config/i18n').default
const filters = require('../../../config/nunjucks/filters')
const componentService = require('../../services/component')
const assessmentPrintButton = require('../assessment-print-button')
const frameworkToTaskListComponent = require('../framework-to-task-list-component')

module.exports = function assessmentToUnconfirmedBanner({
  assessment,
  baseUrl,
  canAccess,
  context,
} = {}) {
  if (!assessment) {
    return undefined
  }

  const taskList = frameworkToTaskListComponent({
    baseUrl: `${baseUrl}/`,
    frameworkSections: assessment._framework.sections,
    sectionProgress: assessment.meta.section_progress,
  })

  let content = `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        ${componentService.getComponent('appTaskList', taskList)}
      </div>
    </div>
  `

  // PER has been completed
  if (
    assessment.status === 'completed' ||
    (assessment.status === 'confirmed' && !assessment.handover_occurred_at)
  ) {
    if (canAccess && canAccess(`${context}:confirm`)) {
      content += `
        ${componentService.getComponent('govukButton', {
          href: `${baseUrl}/confirm`,
          text: i18n.t('actions::provide_confirmation', { context }),
        })}
      `
    }

    content += assessmentPrintButton({ baseUrl, canAccess, context })
  }

  if (assessment.amended_at || assessment.completed_at) {
    const timestampKey = assessment.amended_at ? 'amended_at' : 'completed_at'

    content += `
      <p class="govuk-!-font-size-16 govuk-!-margin-top-1">
        ${i18n.t(timestampKey, {
          date: filters.formatDateWithTimeAndDay(
            assessment[timestampKey],
            true
          ),
        })}
      </p>
    `
  }

  return {
    allowDismiss: false,
    classes: 'app-message--instruction govuk-!-padding-right-0',
    title: {
      text: i18n.t(`messages::assessment.${assessment.status}.heading`, {
        context,
      }),
    },
    content: {
      html: content,
    },
  }
}
