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
        summaryHtml: 'I need to change the PNC number',
        html:
          'If you have created the movement for the wrong person cancel this request and create a new one',
      },
    ],
  },
}

module.exports = updateFields
