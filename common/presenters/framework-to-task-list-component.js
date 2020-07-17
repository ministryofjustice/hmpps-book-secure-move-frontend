const { sortBy } = require('lodash')

const i18n = require('../../config/i18n')

const tagClasses = {
  not_started: 'govuk-tag--grey',
  in_progress: 'govuk-tag--blue',
  default: '',
}

function frameworkToTaskListComponent({
  baseUrl = '',
  sectionProgress = [],
  frameworkSections = {},
} = {}) {
  const tasks = sectionProgress
    .filter(section => frameworkSections[section.key])
    .map(({ key, status }) => {
      const { name, order } = frameworkSections[key]

      return {
        order,
        text: name,
        href: baseUrl + key,
        tag: {
          text: i18n.t(`person-escort-record::statuses.${status}`),
          classes: tagClasses[status] || tagClasses.default,
        },
      }
    })

  return {
    items: sortBy(tasks, ['order', 'text']),
  }
}

module.exports = frameworkToTaskListComponent
