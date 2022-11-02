import { format as formatDate } from 'date-fns'
import * as parsers from '../parsers'

const { oxfordJoin, nonOxfordJoin } = require('../../config/nunjucks/filters')

export function date (value: Date | string, format = 'yyyy-MM-dd'): Date | string {
  const parsedDate = parsers.date(value)
  return parsedDate ? formatDate(parsedDate, format) : value
}

export function time (value: Date | string, format = 'HH:mm') {
  const parsedDate = parsers.date(value)
  return parsedDate ? formatDate(parsedDate, format) : value
}

export function array (array: any[] = [], useOxfordComma = false): string {
  const tidyArray = array
    .filter(i => i)
    .sort()

  return useOxfordComma ? oxfordJoin(tidyArray) : nonOxfordJoin(tidyArray)
}

