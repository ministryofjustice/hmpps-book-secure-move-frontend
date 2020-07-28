const moveType = {
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
  ],
}

module.exports = moveType
