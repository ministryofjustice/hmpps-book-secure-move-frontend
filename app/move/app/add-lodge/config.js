const AddLodgeController = require('./controllers/add-lodge')

module.exports = function config(id) {
  console.log('sdca')
  return {
    controller: AddLodgeController,
    journeyName: `add-lodge-${id}`,
    name: `add-lodge-${id}`,
    template: 'form-wizard',
  }
}
