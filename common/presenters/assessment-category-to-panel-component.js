const { kebabCase, groupBy, map, sortBy } = require('lodash')

const componentService = require('../services/component')

const assessmentAnswersToMetaListComponent = require('./assessment-answers-to-meta-list-component')

function assessmentCategoryToPanelListComponent(category) {
  const { answers, tagClass } = category
  const groupedByTitle = groupBy(answers, 'title')
  const panels = map(groupedByTitle, (answers, title) => {
    const metaList = assessmentAnswersToMetaListComponent(answers)

    return {
      attributes: {
        id: kebabCase(title),
      },
      tag: {
        text: title,
        classes: tagClass,
      },
      html: componentService.getComponent('appMetaList', metaList),
    }
  })

  return {
    ...category,
    count: answers.length,
    panels: sortBy(panels, 'tag.text'),
  }
}

module.exports = assessmentCategoryToPanelListComponent
