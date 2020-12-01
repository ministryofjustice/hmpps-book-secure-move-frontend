const { find, map, mapValues } = require('lodash')

const frameworksService = require('../../../services/frameworks')

module.exports = function assessmentTransformer(data = {}) {
  if (!data.framework) {
    return data
  }

  const framework = frameworksService.getFramework({
    framework: data.framework.name,
    version: data.framework.version,
  })
  const responses = data.responses.map(response => {
    const { description } = framework.questions[response.question.key]

    return {
      ...response,
      question: {
        ...response.question,
        description,
      },
    }
  })

  return {
    ...data,
    responses,
    _framework: {
      ...framework,
      sections: mapValues(framework.sections, section => {
        const sectionFields = map(section.steps, step => step.fields).flat()
        const sectionProgress = find(data.meta?.section_progress, {
          key: section.key,
        })
        const sectionQuestions = sectionFields.reduce((acc, field) => {
          const question = framework.questions[field]

          if (question) {
            acc[field] = question
          }

          return acc
        }, {})
        const sectionResponses = responses.filter(
          response => response.question.section === section.key
        )

        return {
          ...section,
          progress: sectionProgress?.status,
          questions: sectionQuestions,
          responses: sectionResponses,
        }
      }),
    },
  }
}
