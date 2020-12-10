const getEventClassification = require('./get-event-classification')

const getHeaderClasses = event => {
  const classification = getEventClassification(event)

  if (!classification) {
    return ''
  }

  let headerClasses = 'app-tag'

  if (classification === 'incident') {
    headerClasses += ' app-tag--destructive'
  }

  return headerClasses
}

module.exports = getHeaderClasses
