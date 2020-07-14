const i18n = require('../../config/i18n')

const tagClasses = {
  not_started: 'govuk-tag--grey',
  incomplete: 'govuk-tag--blue',
  default: '',
}

function frameworkToTaskListComponent(baseUrl = '') {
  return ({ sections = {} } = {}) => {
    const tasks = Object.entries(sections).map(([k, section]) => {
      const { key, name, status } = section

      return {
        text: name,
        href: baseUrl + key,
        tag: {
          text: i18n.t(`person-escort-record::statuses.${status}`),
          classes: tagClasses[status] || tagClasses.default,
        },
      }
    })

    return {
      items: tasks,
    }
  }
}

module.exports = frameworkToTaskListComponent
