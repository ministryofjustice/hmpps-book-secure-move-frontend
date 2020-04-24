const policeNationalComputer = require('./police-national-computer')

const policeNationalComputerUpdate = {
  ...policeNationalComputer,
  readOnly: true,
  updateComponent: {
    component: 'appReadOnlyField',
    classes: '',
    items: [
      {
        component: 'govukDetails',
        summaryHtml: 'fields::police_national_computer.details.summaryHtml',
        html: 'fields::police_national_computer.details.html',
      },
    ],
  },
}

module.exports = policeNationalComputerUpdate
