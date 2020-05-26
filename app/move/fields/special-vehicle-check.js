const specialVehicleCheck = {
  validate: 'required',
  component: 'govukRadios',
  name: 'special_vehicle_check',
  fieldset: {
    legend: {
      text: 'fields::special_vehicle_check.label',
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      value: 'true',
      text: 'fields::special_vehicle_check.items.yes.label',
    },
    {
      value: 'false',
      text: 'fields::special_vehicle_check.items.no.label',
    },
  ],
}

module.exports = specialVehicleCheck
