const { groupBy, map, sortBy } = require('lodash')

const componentService = require('../services/component')

const assessmentAnswersToMetaListComponent = require('./assessment-answers-to-meta-list-component')

function assessmentCategoryToSummaryListComponent(category = {}) {
  const { answers = [] } = category
  const groupedByTitle = groupBy(answers, 'title')
  const rows = map(groupedByTitle, (answers, title) => {
    const metaList = assessmentAnswersToMetaListComponent(answers)

    return {
      key: {
        classes: 'govuk-!-font-size-16',
        text: title,
      },
      value: {
        html: componentService.getComponent('appMetaList', metaList),
      },
    }
  })

  return {
    ...category,
    count: answers.length,
    rows: sortBy(rows, 'key.text'),
  }
}

module.exports = assessmentCategoryToSummaryListComponent
