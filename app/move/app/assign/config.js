const AssignBaseController = require('./controllers/base')

module.exports = function config(id) {
  return {
    controller: AssignBaseController,
    journeyName: `assign-person-${id}`,
    journeyPageTitle: 'allocation::person:assign',
    name: `assign-person-${id}`,
    template: '../../../form-wizard',
    templatePath: 'move/views/create/',
  }
}
