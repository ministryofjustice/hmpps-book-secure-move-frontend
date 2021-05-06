module.exports = function config(id) {
  return {
    name: `remove-move-from-allocation-${id}`,
    templatePath: 'allocation/views/',
    template: '../../../form-wizard',
    journeyName: `remove-move-from-allocation-${id}`,
    journeyPageTitle: 'actions::cancel_move',
  }
}
