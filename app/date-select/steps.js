const DateSelectController = require('./controller')

const steps = {
  '/': {
    controller: DateSelectController,
    entryPoint: true,
    pageTitle: 'actions::date_select',
    fields: ['date_select'],
    buttonText: 'actions::date_select_submit',
  },
}

module.exports = steps
