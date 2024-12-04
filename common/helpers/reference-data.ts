import { FilterDisabledParams } from '../types/filter_disabled_parameters'
import { FilterDisabledItem } from '../types/filter_disabled_item'
import { FilterExpiredParams } from '../types/filter_expired_parameters'

function filterDisabled({ currentValue = null, createdOn }: FilterDisabledParams = {} as FilterDisabledParams) {
  const createdOnTime = Date.parse(createdOn) || Date.now()

  return function (item: FilterDisabledItem): boolean {
    if (!item.disabled_at) {
      return true
    }

    const isDisabled = Date.parse(item.disabled_at) > createdOnTime
    const isCurrentValue = item.id === currentValue

    return isDisabled || isCurrentValue
  }
}

function filterExpired({ expires_at: expiresAt }: FilterExpiredParams): boolean {
  if (!expiresAt) {
    return true
  }

  return Date.parse(expiresAt) > Date.now()
}

function removeOptions(optionsToRemove?: (string | number)[]) {
  return optionsToRemove
    ? (item: { id: string | number }): boolean => !optionsToRemove.includes(item.id)
    : (_item: { id: string | number }): boolean => true
}

export {
  filterDisabled,
  filterExpired,
  removeOptions,
}
