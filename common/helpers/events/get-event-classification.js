const getEventClassification = event => {
  const { classification } = event
  return classification && classification !== 'default'
    ? classification
    : undefined
}

module.exports = getEventClassification
