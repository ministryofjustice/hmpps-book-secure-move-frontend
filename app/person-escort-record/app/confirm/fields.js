const { cloneDeep } = require('lodash')

const { time: timeFormatter } = require('../../../../common/formatters')
const commonDateField = require('../../../move/app/new/fields/common.date')
const { time: timeValidator } = require('../../../move/validators')

const confirmHandover = {
  id: 'confirm_handover',
  name: 'confirm_handover',
  component: 'govukCheckboxes',
  items: [
    {
      text: 'fields::confirm_handover.label',
      value: 'yes',
    },
  ],
  validate: 'required',
}
const handoverDispatchingOfficer = {
  id: 'handover_dispatching_officer',
  name: 'handover_dispatching_officer',
  component: 'govukInput',
  classes: 'govuk-input--width-20',
  label: {
    text: 'fields::handover_dispatching_officer.label',
    classes: 'govuk-label--s',
  },
  validate: 'required',
}
const handoverDispatchingOfficerId = {
  id: 'handover_dispatching_officer_id',
  name: 'handover_dispatching_officer_id',
  component: 'govukInput',
  classes: 'govuk-input--width-20',
  label: {
    text: 'fields::handover_dispatching_officer_id.label',
    classes: 'govuk-label--s',
  },
  validate: 'required',
}
const handoverDispatchingOfficerContact = {
  id: 'handover_dispatching_officer_contact',
  name: 'handover_dispatching_officer_contact',
  component: 'govukInput',
  classes: 'govuk-input--width-20',
  label: {
    text: 'fields::handover_dispatching_officer_contact.label',
    classes: 'govuk-label--s',
  },
  validate: 'required',
}
const handoverReceivingOfficer = {
  id: 'handover_receiving_officer',
  name: 'handover_receiving_officer',
  component: 'govukInput',
  classes: 'govuk-input--width-20',
  label: {
    text: 'fields::handover_receiving_officer.label',
    classes: 'govuk-label--s',
  },
  validate: 'required',
}
const handoverReceivingOfficerId = {
  id: 'handover_receiving_officer_id',
  name: 'handover_receiving_officer_id',
  component: 'govukInput',
  classes: 'govuk-input--width-20',
  label: {
    text: 'fields::handover_receiving_officer_id.label',
    classes: 'govuk-label--s',
  },
  validate: 'required',
}
const handoverReceivingOfficerContact = {
  id: 'handover_receiving_officer_contact',
  name: 'handover_receiving_officer_contact',
  component: 'govukInput',
  classes: 'govuk-input--width-20',
  label: {
    text: 'fields::handover_receiving_officer_contact.label',
    classes: 'govuk-label--s',
  },
  validate: 'required',
}
const handoverReceivingOrganisation = {
  name: 'handover_receiving_organisation',
  id: 'handover_receiving_organisation',
  component: 'govukRadios',
  fieldset: {
    legend: {
      text: 'fields::handover_receiving_organisation.label',
      classes: 'govuk-fieldset__legend--s',
    },
  },
  items: [
    {
      id: 'handover_receiving_organisation',
      value: 'fields::handover_receiving_organisation.items.supplier.label',
      text: 'fields::handover_receiving_organisation.items.supplier.label',
    },
    {
      value: 'other',
      text: 'fields::handover_receiving_organisation.items.other.label',
      conditional: 'handover_other_organisation',
    },
  ],
  validate: 'required',
}
const handoverOtherOganisation = {
  id: 'handover_other_organisation',
  name: 'handover_other_organisation',
  component: 'govukInput',
  classes: 'govuk-input--width-20',
  label: {
    text: 'fields::handover_other_organisation.label',
    classes: 'govuk-label--s',
  },
  validate: 'required',
}
const handoverTime = {
  validate: 'required',
  name: 'handover_occurred_at',
  id: 'handover_occurred_at',
  component: 'govukRadios',
  fieldset: {
    legend: {
      text: 'fields::handover_occurred_at.label',
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      id: 'handover_occurred_at',
      value: 'now',
      text: 'fields::handover_occurred_at.items.now.label',
    },
    {
      value: 'other',
      text: 'fields::handover_occurred_at.items.historic.label',
      conditional: ['handover_other_date', 'handover_other_time'],
    },
  ],
}
const handoverOtherDate = {
  ...cloneDeep(commonDateField),
  validate: [...commonDateField.validate, 'required', 'before'],
  errorGroup: 'handoverOtherDateTime',
  id: 'handover_other_date',
  name: 'handover_other_date',
  label: {
    text: 'fields::handover_other_date.label',
    classes: 'govuk-label--s',
  },
  hint: {
    html: 'fields::handover_other_date.hint',
  },
  invalidates: ['handover_other_time'],
}
const handoverOtherTime = {
  id: 'handover_other_time',
  name: 'handover_other_time',
  validate: ['required', timeValidator],
  errorGroup: 'handoverOtherDateTime',
  formatter: [timeFormatter],
  component: 'govukInput',
  classes: 'govuk-input--width-5',
  autocomplete: 'off',
  label: {
    html: 'fields::handover_other_time.label',
    classes: 'govuk-label--s',
  },
  hint: {
    html: 'fields::handover_other_time.hint',
  },
}

module.exports = {
  confirm_handover: confirmHandover,
  handover_dispatching_officer: handoverDispatchingOfficer,
  handover_dispatching_officer_id: handoverDispatchingOfficerId,
  handover_dispatching_officer_contact: handoverDispatchingOfficerContact,
  handover_receiving_officer: handoverReceivingOfficer,
  handover_receiving_officer_id: handoverReceivingOfficerId,
  handover_receiving_officer_contact: handoverReceivingOfficerContact,
  handover_receiving_organisation: handoverReceivingOrganisation,
  handover_other_organisation: handoverOtherOganisation,
  handover_occurred_at: handoverTime,
  handover_other_date: handoverOtherDate,
  handover_other_time: handoverOtherTime,
}
