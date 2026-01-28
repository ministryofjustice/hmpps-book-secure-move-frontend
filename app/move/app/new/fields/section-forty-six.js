const sectionFortySix = {
  validate: 'required',
  component: 'govukRadios',
  name: 'section_forty_six',
  hint: {
    text: 'fields::section_forty_six.hint',
  },
  items: [
    {
      value: 'true',
      text: 'Yes',
    },
    {
      value: 'false',
      text: 'No',
    },
  ],
}

module.exports = sectionFortySix
