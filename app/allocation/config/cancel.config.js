const FormWizardController = require('../../../common/controllers/form-wizard')

module.exports = function config(id) {
  return {
    controller: FormWizardController,
    name: `cancel-allocation-${id}`,
    templatePath: 'allocation/views/',
    template: '../../../form-wizard',
    journeyName: `cancel-allocation-${id}`,
    journeyPageTitle: 'actions::cancel_allocation',
  }
}
