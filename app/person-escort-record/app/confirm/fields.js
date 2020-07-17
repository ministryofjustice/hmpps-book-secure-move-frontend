const confirmPersonEscortRecord = {
  name: 'confirm_person_escort_record',
  component: 'govukCheckboxes',
  items: [
    {
      text: 'fields::confirm_person_escort_record.label',
      value: 'yes',
    },
  ],
  validate: 'required',
}

module.exports = {
  confirm_person_escort_record: confirmPersonEscortRecord,
}
