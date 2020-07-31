const { isEmpty } = require('lodash')

const componentService = require('../services/component')

function _mapResponse(response) {
  const responseHtml = componentService.getComponent('appFrameworkResponse', {
    value: isEmpty(response.value) ? undefined : response.value,
    valueType: response.value_type,
  })

  return {
    value: {
      html: `
        <h4 class="govuk-heading-s govuk-!-margin-0 govuk-!-font-size-16">${response.question.description}</h4>
        ${responseHtml}
      `,
    },
  }
}

function frameworkResponsesToMetaListComponent(responses) {
  return {
    classes: 'app-meta-list--divider',
    items: responses.map(_mapResponse),
  }
}

module.exports = frameworkResponsesToMetaListComponent
