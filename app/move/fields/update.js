const { cloneDeep } = require('lodash')

const createFields = require('./create')

const updateFields = cloneDeep(createFields)

updateFields.police_national_computer = {
  ...updateFields.police_national_computer,
  readOnly: true,
  updateComponent: {
    component: 'appReadOnlyField',
    classes: '',
    items: [
      {
        component: 'govukDetails',
        summaryHtml: 'fields::police_national_computer.details.summaryHtml',
        html: 'fields::police_national_computer.details.html',
      },
    ],
  },
}

module.exports = updateFields
