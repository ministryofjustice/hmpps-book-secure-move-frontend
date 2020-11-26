const i18n = require('../../../config/i18n')
const componentService = require('../../services/component')
const frameworkToTaskListComponent = require('../framework-to-task-list-component')

module.exports = function ({ move, baseUrl, canAccess, context }) {
  const assessment = {
    ...move.profile[context],
    // TODO: Remove once this value comes from the API
    is_editable: ['requested', 'booked'].includes(move.status),
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
  `

  // PER has been completed
  if (assessment.status === 'completed' && canAccess(`${context}:confirm`)) {
    content += `
      <p>
        ${i18n.t(`messages::assessment.${assessment.status}.content`, {
          context,
        })}
      </p>

      ${componentService.getComponent('govukButton', {
        href: `${baseUrl}/confirm`,
        text: i18n.t('actions::provide_confirmation'),
        disabled: !assessment.is_editable,
      })}
    `

    if (!assessment.is_editable) {
      content += `
        ${componentService.getComponent('govukWarningText', {
          text: i18n.t(`messages::assessment.${assessment.status}.uneditable`, {
            context,
          }),
          classes: 'govuk-!-padding-top-0 govuk-!-margin-top-5',
          iconFallbackText: 'Warning',
        })}
      `
    }
  }

  content += `
      </div>
    </div>
  `

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
