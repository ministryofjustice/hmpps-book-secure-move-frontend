const FormWizardController = require('../../../common/controllers/form-wizard')

module.exports = function config(id) {
  return {
    controller: FormWizardController,
    name: `remove-move-from-allocation-${id}`,
    templatePath: 'allocation/views/cancel/',
    template: '../../../form-wizard',
    journeyName: `remove-move-from-allocation-${id}`,
    journeyPageTitle: 'actions::cancel_move',
  }
}
