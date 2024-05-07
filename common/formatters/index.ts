import { format as formatDate } from 'date-fns'
import * as parsers from '../parsers'

const { oxfordJoin, nonOxfordJoin } = require('../../config/nunjucks/filters')

export function date (value: Date | string, format = 'yyyy-MM-dd'): Date | string {
  const parsedDate = parsers.date(value)
  return parsedDate ? formatDate(parsedDate, format) : value
}
export function gds_date (value: any, format = 'yyyy-MM-dd'): string {
  console.log("gds_date:")
  console.log(value)
  return value
}

export function gds_time (value: string) {
  console.log("gds_time:")
  console.log(value)
  const parsedTime = parsers.time(value)
  console.log("gds_time parsed:")
  console.log(parsedTime)
  return parsedTime
}

export function time (value: Date | string, format = 'HH:mm') {
  const parsedDate = parsers.date(value)
  return parsedDate ? formatDate(parsedDate, format) : value
}


export function sentenceFormatDate(date: Date) {
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return date.toLocaleDateString('en-GB', dateOptions)
}

export function sentenceFormatTime(date: Date) {
  const timeOptions: Intl.DateTimeFormatOptions = {
    minute: date.getMinutes() > 0 ? 'numeric' : undefined,
    hour: 'numeric',
    hour12: true,
  }

  return date
    .toLocaleTimeString('en-GB', timeOptions)
    .replace(/\s/g, '')
    .replace(/^0/, '12')
}

export function array (array: any[] = [], useOxfordComma = false): string {
  const tidyArray = array
    .filter(i => i)
    .sort()

  return useOxfordComma ? oxfordJoin(tidyArray) : nonOxfordJoin(tidyArray)
}

