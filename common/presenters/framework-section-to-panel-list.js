const { find, kebabCase, omit } = require('lodash')

const frameworkResponseToMetaListComponent = require('./framework-responses-to-meta-list-component')

function frameworkSectionToPanelList({
  tagList = [],
  questions,
  personEscortRecord,
  personEscortRecordUrl = '',
} = {}) {
  return section => {
    const flagsMap = personEscortRecord?.responses
      // Remove responses with no flags
      .filter(response => response.flags.length > 0)
      // Remove responses from other framework sections
      .filter(response => response.question.section === section.key)
      // Reduce to a map with flag title and responses for that flag
      .reduce((acc, response) => {
        response.flags.forEach(flag => {
          const flagGroup = acc[flag.title] || []

          // handle collections and arrays differently to other types
          if (
            response.value_type === 'collection::followup_comment' ||
            response.value_type === 'array'
          ) {
            const existingGroup = flagGroup.find(f => f.id === response.id)
            const flagValue = response.value.filter(
              value => value.option === flag.question_value
            )

            // check to see if response already exists
            // this is to avoid question being duplicated in panel list
            if (existingGroup) {
              existingGroup.value.push(flagValue[0])
            } else {
              flagGroup.push({
                ...response,
                value: flagValue,
              })
            }
          } else {
            flagGroup.push(response)
          }

          acc[flag.title] = flagGroup
        })

        return acc
      }, {})
    const sectionStatus = find(personEscortRecord?.meta?.section_progress, {
      key: section.key,
    })?.status

    const output = {
      key: section.key,
      name: section.name,
      url: `${personEscortRecordUrl}/${section.key}`,
      isCompleted: sectionStatus === 'completed',
      panels: tagList
        // Filter tags to just this section
        .filter(tag => tag.section === section.key)
        // Return a meta list component for each tag
        .map(tag => {
          // Loop over each item to append question description
          const flagsWithQuestionDescription = (flagsMap[tag.text] || []).map(
            response => {
              const { description } = questions[response.question.key]

              return {
                ...response,
                question: {
                  ...response.question,
                  description,
                },
              }
            }
          )

          return {
            // Remove link so that when displayed in the main
            // body the tag isn't linked
            tag: omit(tag, ['href']),
            attributes: { id: kebabCase(tag.text) },
            metaList: frameworkResponseToMetaListComponent(
              flagsWithQuestionDescription
            ),
          }
        }),
    }

    return output
  }
}

module.exports = frameworkSectionToPanelList
