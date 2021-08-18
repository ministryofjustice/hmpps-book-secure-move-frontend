const { kebabCase } = require('lodash')

const componentService = require('../services/component')

const frameworkFlagsToTagList = require('./framework-flags-to-tag-list')
const frameworkResponseToMetaListComponent = require('./framework-responses-to-meta-list-component')

function frameworkSectionToPanelList({ baseUrl = '' } = {}) {
  return section => {
    const { responses = [] } = section
    const sectionFlags = responses.map(response => response.flags).flat()
    const tagList = frameworkFlagsToTagList({ flags: sectionFlags })
    const responseByFlag = responses
      // Remove responses with no flags
      .filter(response => response.flags.length > 0)
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
    const panels = tagList.map(tag => {
      const metaList = frameworkResponseToMetaListComponent(
        responseByFlag[tag.text]
      )

      return {
        tag,
        isFocusable: true,
        attributes: { id: kebabCase(tag.text) },
        html: componentService.getComponent('appMetaList', metaList),
      }
    })

    return {
      key: section.key,
      name: section.name,
      order: section.order,
      url: `${baseUrl}/${section.key}`,
      isCompleted: section.progress === 'completed',
      count: panels.length,
      context: 'framework',
      panels,
    }
  }
}

module.exports = frameworkSectionToPanelList
