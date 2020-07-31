const { kebabCase, omit } = require('lodash')

const frameworkResponseToMetaListComponent = require('./framework-responses-to-meta-list-component')

function frameworkSectionToPanelList({
  tagList,
  framework,
  personEscortRecord,
  personEscortRecordUrl,
}) {
  return section => {
    const flagsMap = personEscortRecord?.responses
      .filter(response => response.flags.length > 0)
      .filter(response => response.question.section === section.key)
      .reduce((acc, response) => {
        delete response.person_escort_record
        delete response.question.framework
        response.flags.forEach(flag => {
          if (!acc[flag.title]) {
            acc[flag.title] = []
          }

          if (response.value_type === 'collection') {
            acc[flag.title].push({
              ...response,
              value: response.value.filter(value => {
                return value.option === flag.question_value
              }),
            })
          } else {
            acc[flag.title].push(response)
          }
        })

        return acc
      }, {})

    return {
      key: section.key,
      name: section.name,
      url: `${personEscortRecordUrl}/${section.key}/overview`,
      panels: tagList
        .filter(tag => tag.section === section.key)
        .map(tag => {
          return {
            attributes: {
              id: kebabCase(tag.text),
            },
            tag: omit(tag, ['href']),
            metaList: frameworkResponseToMetaListComponent(
              flagsMap[tag.text].map(response => {
                const question = framework.questions[response.question.key]

                return {
                  ...response,
                  question: {
                    ...response.question,
                    description: question.description,
                  },
                }
              })
            ),
          }
        }),
    }
  }
}

module.exports = frameworkSectionToPanelList
