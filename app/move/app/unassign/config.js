const FormWizardController = require('../../../../common/controllers/form-wizard')

module.exports = function config(id) {
  return {
    controller: FormWizardController,
    journeyName: `unassign-person-${id}`,
    journeyPageTitle: 'actions::cancel_allocation',
    name: `unassign-person-${id}`,
    template: '../../../form-wizard',
    templatePath: 'move/app/unassign',
  }
}
