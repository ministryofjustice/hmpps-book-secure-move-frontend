const FormWizardController = require('../../../common/controllers/form-wizard')

module.exports = function config(id) {
  return {
    controller: FormWizardController,
    journeyName: `cancel-move-${id}`,
    name: `cancel-move-${id}`,
    template: 'form-wizard',
  }
}
