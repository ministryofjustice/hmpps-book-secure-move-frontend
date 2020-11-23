const FormWizardController = require('../../../common/controllers/form-wizard')

module.exports = {
  controller: FormWizardController,
  name: 'create-an-allocation',
  templatePath: 'allocation/views/create/',
  template: '../../../form-wizard',
  journeyName: 'create-an-allocation',
  journeyPageTitle: 'actions::create_allocation',
}
