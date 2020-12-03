const { find } = require('lodash')

module.exports = function mapItemToSection({ meta = {}, responses = [] } = {}) {
  return section => {
    const sectionProgress = find(meta.section_progress, {
      key: section.key,
    })
    const sectionResponses = responses.filter(
      response => response.question.section === section.key
    )
    const sectionQuestions = sectionResponses.reduce((acc, response) => {
      const question = response._question

      if (question) {
        acc[question.name] = question
      }

      return acc
    }, {})

    return {
      ...section,
      progress: sectionProgress ? sectionProgress.status : undefined,
      questions: sectionQuestions,
      responses: sectionResponses,
    }
  }
}
