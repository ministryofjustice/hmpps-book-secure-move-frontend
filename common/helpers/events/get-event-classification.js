const getEventClassification = event => {
  const { event_type: eventType, classification } = event

  if (eventType === 'PerPropertyChange') {
    return classification
  }

  return classification && classification !== 'default'
    ? classification
    : undefined
}

module.exports = getEventClassification
