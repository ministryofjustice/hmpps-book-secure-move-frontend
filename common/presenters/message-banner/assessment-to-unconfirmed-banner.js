const i18n = require('../../../config/i18n')
const filters = require('../../../config/nunjucks/filters')
const componentService = require('../../services/component')
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
    deepLinkToFirstStep: true,
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
  if (assessment.status === 'completed') {
    if (canAccess && canAccess(`${context}:confirm`)) {
      content += `
        ${componentService.getComponent('govukButton', {
          href: assessment.editable ? `${baseUrl}/confirm` : '',
          text: i18n.t('actions::provide_confirmation', { context }),
          disabled: !assessment.editable,
        })}
      `
    }

    if (canAccess && canAccess(`${context}:print`)) {
      content += `
        <p>
          <a href="${baseUrl}/print" class="app-icon app-icon--print">
            ${i18n.t('actions::print_assessment', {
              context,
            })}
          </a>
        </p>
      `
    }
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

  if (!assessment.editable) {
    content += `
      ${componentService.getComponent('govukWarningText', {
        text: i18n.t('messages::assessment.completed.uneditable', {
          context,
        }),
        classes: 'govuk-!-padding-top-0 govuk-!-margin-top-5',
        iconFallbackText: 'Warning',
      })}
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
