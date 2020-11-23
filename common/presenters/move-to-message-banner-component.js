const { isEmpty } = require('lodash')

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

function moveToMessageBannerComponent({ move, moveUrl, canAccess }) {
  const { profile, status } = move
  const { id: profileId, person_escort_record: personEscortRecord } =
    profile || {}

  if (['proposed'].includes(status) || !profileId) {
    return undefined
  }

  let title
  let content

  // No PER exists
  if (['requested', 'booked'].includes(status) && isEmpty(personEscortRecord)) {
    title = i18n.t('messages::person_escort_record_pending.heading')
    content = `<p>${i18n.t(
      'messages::person_escort_record_pending.content'
    )}</p>`

    if (canAccess('person_escort_record:create')) {
      content += `
        ${componentService.getComponent('govukButton', {
          href: `${moveUrl}/person-escort-record/new`,
          text: i18n.t('actions::start_person_escort_record'),
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
  } = personEscortRecord || {}

  // PER has been confirmed
  if (personEscortRecord && perStatus === 'confirmed') {
    title = i18n.t('messages::person_escort_record_confirmed.heading')
    content = `
      <p>
        ${i18n.t('messages::person_escort_record_confirmed.content', {
          date: filters.formatDateWithTimeAndDay(confirmedAt),
        })}
      </p>

      <p>
        <a href="${moveUrl}/person-escort-record/print" class="app-icon app-icon--print">
          ${i18n.t('actions::print_person_escort_record')}
        </a>
      </p>
    `

    return _returnComponent(title, content)
  }

  // PER is unconfirmed
  if (personEscortRecord && perStatus !== 'confirmed') {
    const taskList = frameworkToTaskListComponent({
      baseUrl: `${moveUrl}/person-escort-record/`,
      deepLinkToFirstStep: true,
      frameworkSections: _framework.sections,
      sectionProgress: meta.section_progress,
    })

    title = i18n.t(
      `messages::person_escort_record_${
        perStatus === 'completed' ? 'complete' : 'incomplete'
      }.heading`
    )
    content = `
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-two-thirds">
          ${componentService.getComponent('appTaskList', taskList)}
    `

    // PER has been completed
    if (
      perStatus === 'completed' &&
      canAccess('person_escort_record:confirm')
    ) {
      content += `
        <p>
          ${i18n.t('messages::person_escort_record_complete.content')}
        </p>

        ${componentService.getComponent('govukButton', {
          href: `${moveUrl}/person-escort-record/confirm`,
          text: i18n.t('actions::provide_confirmation'),
          disabled: !['requested', 'booked'].includes(status),
        })}
      `

      if (!['requested', 'booked'].includes(status)) {
        content += `
          ${componentService.getComponent('govukWarningText', {
            text: i18n.t('person-escort-record::left_custody'),
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
