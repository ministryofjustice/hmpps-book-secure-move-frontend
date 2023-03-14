module.exports = function config(id) {
  console.log('sdca')
  return {
    journeyName: `add-lodge-${id}`,
    name: `add-lodge-${id}`,
    template: 'form-wizard',
  }
}
