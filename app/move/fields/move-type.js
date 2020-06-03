const moveType = {
  component: 'govukRadios',
  fieldset: {
    legend: {
      classes: 'govuk-fieldset__legend--m',
      text: 'fields::move_type.label',
    },
  },
  items: [
    {
      conditional: 'to_location_court_appearance',
      id: 'move_type',
      text: 'fields::move_type.items.court_appearance.label',
      value: 'court_appearance',
    },
    {
      conditional: 'to_location_prison_transfer',
      text: 'fields::move_type.items.prison_transfer.label',
      value: 'prison_transfer',
    },
    {
      conditional: 'prison_recall_comments',
      text: 'fields::move_type.items.prison_recall.label',
      value: 'prison_recall',
    },
  ],
  name: 'move_type',
  validate: 'required',
}

module.exports = moveType
