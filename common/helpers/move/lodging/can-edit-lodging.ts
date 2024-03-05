import { differenceInDays, parseISO } from 'date-fns'

import { Lodging } from '../../../types/lodging'

export function canEditLodging(
  lodging: Lodging,
  canAccess = (_permission: string) => false
) {
  // eslint-disable-next-line camelcase
  const { status, start_date } = lodging
  const startDate = parseISO(start_date)

  return (
    canAccess('move:lodging:update') &&
    status === 'proposed' &&
    differenceInDays(Date.now(), startDate) <= 0
  )
}
