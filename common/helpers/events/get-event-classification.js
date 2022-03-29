const getEventClassification = event => {
  const { event_type: eventType, classification } = event

  if (eventType === 'PerPropertyChange') {
    return classification
  }

  if (eventType === 'PersonMoveDeathInCustody') {
    return 'default'
  }

  return classification && classification !== 'default'
    ? classification
    : undefined
}

module.exports = getEventClassification
