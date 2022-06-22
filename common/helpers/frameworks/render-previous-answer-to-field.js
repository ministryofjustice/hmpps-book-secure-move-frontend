const { find, set, cloneDeep } = require('lodash')

const i18n = require('../../../config/i18n').default

function renderPreviousAnswerToField({ responses = [] } = {}) {
  return ([key, field]) => {
    const response = find(responses, ['question.key', key])

    if (!response) {
      return [key, field]
    }

    if (response.responded !== false) {
      return [key, field]
    }

    if (response.prefilled !== true) {
      return [key, field]
    }

    const copy = cloneDeep(field)
    let hintContent = copy.hint?.html || ''

    hintContent += `
      <span class="app-form-group__message-text">
        ${i18n.t('assessment::prefilled_message')}
      </span>
    `

    set(copy, 'hint.html', hintContent)
    set(copy, 'formGroup.classes', 'app-form-group--message')

    return [key, copy]
  }
}

module.exports = renderPreviousAnswerToField
