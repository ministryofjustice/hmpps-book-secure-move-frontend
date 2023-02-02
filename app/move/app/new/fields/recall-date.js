const { cloneDeep } = require('lodash')

const commonDateField = require('./common.date')

const recallDate = {
  ...cloneDeep(commonDateField),
  validate: [
    {
      type: 'date',
      message: 'The date they were arrested for recall must be a real date',
    },
    {
      type: 'required',
      message: 'Enter the date they were arrested for recall',
    },
    {
      type: 'before',
      message:
        'The date they were arrested for recall must be today or in the past',
    },
  ],
  id: 'recall_date',
  name: 'recall_date',
  label: {
    text: 'fields::recall_information.label',
    classes: 'govuk-label--s',
  },
  hint: {
    text: 'fields::recall_information.hint',
  },
}

module.exports = recallDate
