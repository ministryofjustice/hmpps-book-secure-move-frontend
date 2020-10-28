const { isEmpty } = require('lodash')

const componentService = require('../services/component')

function _mapResponse(response) {
  const responseHtml = componentService.getComponent('appFrameworkResponse', {
    value: isEmpty(response.value) ? undefined : response.value,
    valueType: response.value_type,
    responded: response.responded,
  })
  const description = response.question?.description

  return {
    value: {
      html: `<h4 class="govuk-heading-s govuk-!-margin-bottom-2 govuk-!-font-size-16">${description}</h4>${responseHtml}`,
    },
  }
}

function frameworkResponsesToMetaListComponent(responses = []) {
  return {
    classes: 'app-meta-list--divider',
    items: responses.map(_mapResponse),
  }
}

module.exports = frameworkResponsesToMetaListComponent
