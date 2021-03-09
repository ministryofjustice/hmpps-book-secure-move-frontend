const { cloneDeep } = require('lodash')

const policeNationalComputer = require('../../new/fields/police-national-computer')

const policeNationalComputerUpdate = {
  ...cloneDeep(policeNationalComputer),
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
