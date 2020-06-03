const specialVehicleCheck = {
  component: 'govukRadios',
  fieldset: {
    legend: {
      classes: 'govuk-fieldset__legend--m',
      text: 'fields::special_vehicle_check.label',
    },
  },
  items: [
    {
      text: 'fields::special_vehicle_check.items.yes.label',
      value: 'true',
    },
    {
      text: 'fields::special_vehicle_check.items.no.label',
      value: 'false',
    },
  ],
  name: 'special_vehicle_check',
  validate: 'required',
}

module.exports = specialVehicleCheck
