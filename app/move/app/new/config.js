const CreateBaseController = require('./controllers/base')

module.exports = function config(id) {
  return {
    controller: CreateBaseController,
    journeyName: `create-a-move-${id}`,
    journeyPageTitle: 'actions::create_move',
    name: `create-a-move-${id}`,
    template: '../../../../form-wizard',
    templatePath: 'move/app/new/views/',
  }
}
