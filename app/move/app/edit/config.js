const UpdateBaseController = require('./controllers/base')

module.exports = function config(id) {
  return {
    controller: UpdateBaseController,
    templatePath: 'move/app/new/views/',
    template: '../../../../form-wizard',
    journeyPageTitle: 'actions::update_move',
  }
}
