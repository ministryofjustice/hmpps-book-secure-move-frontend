const DateSelectController = require('./controller')

const steps = {
  '/': {
    controller: DateSelectController,
    entryPoint: true,
    pageTitle: 'date_select::heading',
    fields: ['date_select'],
    buttonText: 'date_select::submit',
  },
}

module.exports = steps
