const { cloneDeep } = require('lodash')

const commonDatePickerField = require('../move/app/new/fields/common.date-picker')
const { time: timeFormatter } = require('../../common/formatters')
const { time: timeValidator } = require('../move/validators')

const fields = {
  stakeholder_group: {
    id: 'stakeholder_group',
    name: 'stakeholder_group',
    component: 'govukRadios',
    fieldset: {
      legend: {
        text: 'Which professional group do you belong to?',
        isPageHeading: true,
        classes: 'govuk-fieldset__legend--l'
      }
    },
    validate: ['required'],
    items: [
      { text: 'Prison and probation staff', value: 'prison_probation_staff' },
      {
        text: 'Healthcare',
        value: 'healthcare',
        hint: {
          text: 'Including prison healthcare, paramedics and liaison and diversion staff'
        }
      },
      {
        text: 'Inspection or monitoring bodies',
        value: 'inspection_monitoring',
        hint: {
          text: 'For example inspectors, lay observers or HMPPS tier 2 assurance groups'
        }
      },
      {
        text: 'Other professional visitors',
        value: 'other',
        hint: {
          text: 'For example police officers, legal representations, the judiciary or support agencies'
        }
      }
    ]
  },
  event_date: {
    ...cloneDeep(commonDatePickerField),
    validate: [...commonDatePickerField.validate, 'required', 'before'],
    id: 'event_date',
    name: 'event_date',
    label: {
      text: 'Date of the event',
      classes: 'govuk-label--m'
    },
    hint: {
      text: 'For example, 17/5/2024.'
    },
    component: 'mojDatePicker',
    errorMessages: { required: 'Enter or select a date' }
  },
  event_time: {
    id: 'event_time',
    name: 'event_time',
    validate: ['required', timeValidator],
    formatter: [timeFormatter],
    label: {
      text: 'Time of the event',
      classes: 'govuk-label--m'
    },
    hint: {
      text: 'For example, 11:00 or 14:00'
    },
    component: 'govukInput',
    classes: 'govuk-input--width-5',
    errorMessages: { required: 'Enter a time' }
  },
  event_summary: {
    id: 'event_summary',
    name: 'event_summary',
    label: {
      text: 'Summarise the event',
      classes: 'govuk-label--m'
    },
    hint: {
      text: 'Include any finding or recommendations. Your summary with appear in the history of events for this move.'
    },
    component: 'govukCharacterCount',
    maxlength: 250,
    validate: ['required'],
    errorMessages: { required: 'Provide a summary of the event' }
  },
  further_details: {
    id: 'further_details',
    name: 'further_details',
    label: {
      text: 'Provide further information (optional)',
      classes: 'govuk-label--m'
    },
    hint: {
      text: 'Give more detail about your contact with the person in custody, or cut and paste content from your report or assessment.'
    },
    component: 'govukTextarea'
  }
}

export default fields
