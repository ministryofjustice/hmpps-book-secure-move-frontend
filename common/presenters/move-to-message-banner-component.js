const { isEmpty, kebabCase } = require('lodash')

const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')
const componentService = require('../services/component')

const frameworkToTaskListComponent = require('./framework-to-task-list-component')

function _returnComponent(title, content) {
  return {
    allowDismiss: false,
    classes: 'app-message--instruction govuk-!-padding-right-0',
    title: {
      text: title,
    },
    content: {
      html: content,
    },
  }
}

function moveToMessageBannerComponent({
  move,
  moveUrl,
  canAccess,
  assessmentType,
}) {
  const { profile, status } = move
  const { id: profileId, [assessmentType]: assessment } = profile || {}
  const baseUrl = `${moveUrl}/${kebabCase(assessmentType)}`
  const context = assessmentType

  if (['proposed'].includes(status) || !profileId) {
    return undefined
  }

  let title
  let content

  // No PER exists
  if (['requested', 'booked'].includes(status) && isEmpty(assessment)) {
    title = i18n.t('messages::assessment.pending.heading', { context })
    content = `<p>${i18n.t('messages::assessment.pending.content', {
      context,
    })}</p>`

    if (canAccess(`${assessmentType}:create`)) {
      content += `
        ${componentService.getComponent('govukButton', {
          href: `${baseUrl}/new`,
          text: i18n.t('actions::start_assessment', {
            context,
          }),
        })}
      `
    }

    return _returnComponent(title, content)
  }

  const {
    _framework = {},
    meta = {},
    status: perStatus,
    confirmed_at: confirmedAt,
  } = assessment || {}

  // PER has been confirmed
  if (assessment && perStatus === 'confirmed') {
    title = i18n.t(`messages::assessment.${perStatus}.heading`, { context })
    content = `
      <p>
        ${i18n.t(`messages::assessment.${perStatus}.content`, {
          context,
          date: filters.formatDateWithTimeAndDay(confirmedAt),
        })}
      </p>

      <p>
        <a href="${baseUrl}/print" class="app-icon app-icon--print">
          ${i18n.t('actions::print_assessment', {
            context,
          })}
        </a>
      </p>
    `

    return _returnComponent(title, content)
  }

  // PER is unconfirmed
  if (assessment && perStatus !== 'confirmed') {
    const taskList = frameworkToTaskListComponent({
      baseUrl: `${baseUrl}/`,
      deepLinkToFirstStep: true,
      frameworkSections: _framework.sections,
      sectionProgress: meta.section_progress,
    })

    title = i18n.t(`messages::assessment.${perStatus}.heading`, { context })
    content = `
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-two-thirds">
          ${componentService.getComponent('appTaskList', taskList)}
    `

    // PER has been completed
    if (perStatus === 'completed' && canAccess(`${assessmentType}:confirm`)) {
      content += `
        <p>
          ${i18n.t(`messages::assessment.${perStatus}.content`, {
            context,
          })}
        </p>

        ${componentService.getComponent('govukButton', {
          href: `${baseUrl}/confirm`,
          text: i18n.t('actions::provide_confirmation'),
          disabled: !['requested', 'booked'].includes(status),
        })}
      `

      if (!['requested', 'booked'].includes(status)) {
        content += `
          ${componentService.getComponent('govukWarningText', {
            text: i18n.t(`messages::assessment.${perStatus}.uneditable`, {
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

    return _returnComponent(title, content)
  }

  return undefined
}

module.exports = moveToMessageBannerComponent
