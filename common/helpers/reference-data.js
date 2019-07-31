function filterDisabled({ currentValue = null, createdOn } = {}) {
  const createdOnTime = Date.parse(createdOn) || Date.now()

  return function(item) {
    if (!item.disabled_at) {
      return true
    }

    const isDisabled = Date.parse(item.disabled_at) > createdOnTime
    const isCurrentValue = item.id === currentValue

    return isDisabled || isCurrentValue
  }
}

module.exports = {
  filterDisabled,
}
