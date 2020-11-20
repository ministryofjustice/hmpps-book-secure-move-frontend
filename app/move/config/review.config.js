const FormWizardController = require('../../../common/controllers/form-wizard')

module.exports = function config(id) {
  return {
    controller: FormWizardController,
    template: 'form-wizard',
    name: `review-move-${id}`,
    journeyName: `review-move-${id}`,
  }
}
