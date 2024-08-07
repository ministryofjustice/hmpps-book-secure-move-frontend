function filterDisabled({ currentValue = null, createdOn } = {}) {
  const createdOnTime = Date.parse(createdOn) || Date.now()

  return function (item) {
    if (!item.disabled_at) {
      return true
    }

    const isDisabled = Date.parse(item.disabled_at) > createdOnTime
    const isCurrentValue = item.id === currentValue

    return isDisabled || isCurrentValue
  }
}

function filterExpired({ expires_at: expiresAt }) {
  if (!expiresAt) {
    return true
  }

  return Date.parse(expiresAt) > Date.now()
}

function removeOptions(optionsToRemove) {
  return optionsToRemove
    ? item => !optionsToRemove.includes(item.id)
    : item => true
}

module.exports = {
  filterDisabled,
  filterExpired,
  removeOptions,
}
