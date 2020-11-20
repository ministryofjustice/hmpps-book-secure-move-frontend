const UpdateBaseController = require('../controllers/update/base')

module.exports = function config(id) {
  return {
    controller: UpdateBaseController,
    templatePath: 'move/views/create/',
    template: '../../../form-wizard',
    journeyPageTitle: 'actions::update_move',
  }
}
