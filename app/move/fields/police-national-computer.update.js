const policeNationalComputer = require('./police-national-computer')

const policeNationalComputerUpdate = {
  ...policeNationalComputer,
  readOnly: true,
  updateComponent: {
    classes: '',
    component: 'appReadOnlyField',
    items: [
      {
        component: 'govukDetails',
        html: 'fields::police_national_computer.details.html',
        summaryHtml: 'fields::police_national_computer.details.summaryHtml',
      },
    ],
  },
}

module.exports = policeNationalComputerUpdate
