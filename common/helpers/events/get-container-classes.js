const getEventClassification = require('./get-event-classification')

const getContainerClasses = event => {
  return getEventClassification(event) ? 'app-panel' : ''
}

module.exports = getContainerClasses
