const moveType = {
  id: 'move_type',
  validate: 'required',
  component: 'govukRadios',
  name: 'move_type',
  fieldset: {
    legend: {
      text: 'fields::move_type.label',
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      id: 'move_type',
      value: 'court_appearance',
      text: 'fields::move_type.items.court_appearance.label',
      conditional: 'to_location_court_appearance',
    },
    {
      value: 'prison_transfer',
      text: 'fields::move_type.items.prison_transfer.label',
      conditional: 'to_location_prison_transfer',
    },
    {
      value: 'hospital',
      text: 'fields::move_type.items.hospital.label',
      conditional: 'to_location_hospital',
    },
    {
      value: 'prison_recall',
      text: 'fields::move_type.items.prison_recall.label',
      conditional: 'prison_recall_comments',
    },
    {
      value: 'police_transfer',
      text: 'fields::move_type.items.police_transfer.label',
      conditional: 'to_location_police_transfer',
    },
    {
      value: 'video_remand',
      text: 'fields::move_type.items.video_remand.label',
      conditional: 'video_remand_comments',
    },
    {
      value: 'secure_childrens_home',
      text: 'fields::move_type.items.secure_childrens_home.label',
      conditional: 'to_location_secure_childrens_home',
    },
    {
      value: 'secure_training_centre',
      text: 'fields::move_type.items.secure_training_centre.label',
      conditional: 'to_location_secure_training_centre',
    },
    {
      value: 'approved_premises',
      text: 'fields::move_type.items.approved_premises.label',
      conditional: 'to_location_approved_premises',
    },
    {
      value: 'extradition',
      text: 'fields::move_type.items.extradtion.label',
      conditional: 'to_location_extradition',
    },
  ],
}

module.exports = moveType
