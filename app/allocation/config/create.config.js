module.exports = function config(id) {
  return {
    name: `create-an-allocation-${id}`,
    templatePath: 'allocation/views/create/',
    template: '../../../form-wizard',
    journeyName: `create-an-allocation-${id}`,
    journeyPageTitle: 'actions::create_allocation',
  }
}
