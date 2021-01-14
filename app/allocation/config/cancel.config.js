module.exports = function config(id) {
  return {
    name: `cancel-allocation-${id}`,
    templatePath: 'allocation/views/',
    template: '../../../form-wizard',
    journeyName: `cancel-allocation-${id}`,
    journeyPageTitle: 'actions::cancel_allocation',
  }
}
